import { z } from 'zod'
import OpenAI from 'openai'

const aiResponseSchema = z.object({
  summary: z.string(),
  riskLevel: z.enum(['low', 'medium', 'high']),
  recommendedActions: z.array(z.string()),
})

type Provider = 'auto' | 'deepseek' | 'openai'

interface RequestBody {
  prompt: string
  provider: Provider
}

const toErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : 'Unknown error'

const normalizeRiskLevel = (value: unknown): 'low' | 'medium' | 'high' => {
  const normalized = String(value ?? '')
    .trim()
    .toLowerCase()

  if (normalized.includes('low') || normalized.includes('bajo')) {
    return 'low'
  }

  if (normalized.includes('medium') || normalized.includes('medio')) {
    return 'medium'
  }

  return 'high'
}

const normalizeAiPayload = (payload: unknown): unknown => {
  if (!payload || typeof payload !== 'object') {
    return payload
  }

  const raw = payload as Record<string, unknown>
  const actions = Array.isArray(raw.recommendedActions)
    ? raw.recommendedActions.map((item) => String(item))
    : []

  return {
    ...raw,
    summary: String(raw.summary ?? ''),
    riskLevel: normalizeRiskLevel(raw.riskLevel),
    recommendedActions: actions,
  }
}

const readEnv = (key: string): string | undefined => {
  const state = globalThis as { process?: { env?: Record<string, string | undefined> } }
  return state.process?.env?.[key]
}

const createClient = (apiKey: string, baseURL: string) =>
  new OpenAI({
    apiKey,
    baseURL,
  })

const parseJsonPayload = (raw: string): unknown => {
  try {
    return JSON.parse(raw)
  } catch {
    const start = raw.indexOf('{')
    const end = raw.lastIndexOf('}')

    if (start === -1 || end === -1 || end <= start) {
      throw new Error('Provider response is not valid JSON')
    }

    return JSON.parse(raw.slice(start, end + 1))
  }
}

const requestProvider = async (
  client: OpenAI,
  model: string,
  prompt: string,
  forceJsonObject: boolean,
): Promise<unknown> => {
  const completion = await client.chat.completions.create({
    model,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.2,
    ...(forceJsonObject ? { response_format: { type: 'json_object' as const } } : {}),
  })

  const raw = completion.choices[0]?.message?.content

  if (typeof raw !== 'string') {
    throw new Error('Provider returned an invalid response payload')
  }

  return parseJsonPayload(raw)
}

export const completeWithAi = async (input: RequestBody) => {
  const enableAi = (readEnv('ENABLE_AI') ?? 'false').toLowerCase() === 'true'

  if (!enableAi) {
    return {
      summary: 'AI is disabled by configuration.',
      riskLevel: 'medium' as const,
      recommendedActions: ['Set ENABLE_AI=true', 'Restart dev server', 'Retry insight generation'],
      providerUsed: 'none' as const,
    }
  }

  const deepSeekApiKey = readEnv('DEEP_SEEK_API_KEY') ?? ''
  const deepSeekBaseUrl = readEnv('DEEP_SEEK_BASE_URL') ?? 'https://api.deepseek.com/v1'
  const openAiApiKey = readEnv('OPEN_AI_API_KEY') ?? ''
  const openAiBaseUrl = readEnv('OPEN_AI_BASE_URL') ?? 'https://api.openai.com/v1'

  const deepSeekClient = deepSeekApiKey ? createClient(deepSeekApiKey, deepSeekBaseUrl) : null
  const openAiClient = openAiApiKey ? createClient(openAiApiKey, openAiBaseUrl) : null

  const deepSeek = async () => {
    if (!deepSeekClient) {
      throw new Error('Missing DeepSeek API key')
    }

    return requestProvider(deepSeekClient, 'deepseek-chat', input.prompt, false)
  }

  const openAi = async () => {
    if (!openAiClient) {
      throw new Error('Missing OpenAI API key')
    }

    return requestProvider(openAiClient, 'gpt-4o-mini', input.prompt, true)
  }

  try {
    if (input.provider === 'deepseek') {
      return {
        ...aiResponseSchema.parse(normalizeAiPayload(await deepSeek())),
        providerUsed: 'deepseek' as const,
      }
    }

    if (input.provider === 'openai') {
      return {
        ...aiResponseSchema.parse(normalizeAiPayload(await openAi())),
        providerUsed: 'openai' as const,
      }
    }

    return {
      ...aiResponseSchema.parse(normalizeAiPayload(await deepSeek())),
      providerUsed: 'deepseek' as const,
    }
  } catch (firstError) {
    if (input.provider === 'deepseek') {
      return {
        summary: 'DeepSeek request failed, deterministic fallback returned.',
        riskLevel: 'high' as const,
        recommendedActions: [
          `Error: ${toErrorMessage(firstError)}`,
          'Review DeepSeek API key',
          'Verify DeepSeek base URL',
          'Try auto provider mode',
        ],
        providerUsed: 'none' as const,
      }
    }

    try {
      return {
        ...aiResponseSchema.parse(normalizeAiPayload(await openAi())),
        providerUsed: 'openai' as const,
      }
    } catch (secondError) {
      return {
        summary: 'All providers failed, deterministic fallback returned.',
        riskLevel: 'high' as const,
        recommendedActions: [
          `DeepSeek/Error: ${toErrorMessage(firstError)}`,
          `OpenAI/Error: ${toErrorMessage(secondError)}`,
          'Review API credentials',
          'Verify provider base URLs',
          'Temporarily disable AI',
        ],
        providerUsed: 'none' as const,
      }
    }
  }
}
