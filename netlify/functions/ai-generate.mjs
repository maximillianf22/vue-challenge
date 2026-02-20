import OpenAI from 'openai'
import { z } from 'zod'

const bodySchema = z.object({
  prompt: z.string().min(1),
  provider: z.enum(['auto', 'deepseek', 'openai']).default('auto'),
})

const aiResponseSchema = z.object({
  summary: z.string(),
  riskLevel: z.enum(['low', 'medium', 'high']),
  recommendedActions: z.array(z.string()),
})

const jsonResponse = (payload, statusCode = 200) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
})

const parseJsonPayload = (raw) => {
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

const normalizeRiskLevel = (value) => {
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

const normalizeAiPayload = (payload) => {
  if (!payload || typeof payload !== 'object') {
    return payload
  }

  const raw = payload
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

const createClient = (apiKey, baseURL) =>
  new OpenAI({
    apiKey,
    baseURL,
  })

const requestProvider = async (client, model, prompt, forceJsonObject) => {
  const completion = await client.chat.completions.create({
    model,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.2,
    ...(forceJsonObject ? { response_format: { type: 'json_object' } } : {}),
  })

  const raw = completion.choices[0]?.message?.content

  if (typeof raw !== 'string') {
    throw new Error('Provider returned an invalid response payload')
  }

  return parseJsonPayload(raw)
}

const toErrorMessage = (error) => (error instanceof Error ? error.message : 'Unknown error')

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405)
  }

  try {
    const body = bodySchema.parse(JSON.parse(event.body ?? '{}'))
    const enableAi = (process.env.ENABLE_AI ?? 'false').toLowerCase() === 'true'

    if (!enableAi) {
      return jsonResponse({
        summary: 'AI is disabled by configuration.',
        riskLevel: 'medium',
        recommendedActions: ['Set ENABLE_AI=true', 'Redeploy site', 'Retry insight generation'],
        providerUsed: 'none',
      })
    }

    const deepSeekApiKey = process.env.DEEP_SEEK_API_KEY ?? ''
    const deepSeekBaseUrl = process.env.DEEP_SEEK_BASE_URL ?? 'https://api.deepseek.com/v1'
    const openAiApiKey = process.env.OPEN_AI_API_KEY ?? ''
    const openAiBaseUrl = process.env.OPEN_AI_BASE_URL ?? 'https://api.openai.com/v1'

    const deepSeekClient = deepSeekApiKey ? createClient(deepSeekApiKey, deepSeekBaseUrl) : null
    const openAiClient = openAiApiKey ? createClient(openAiApiKey, openAiBaseUrl) : null

    const deepSeek = async () => {
      if (!deepSeekClient) {
        throw new Error('Missing DeepSeek API key')
      }

      return requestProvider(deepSeekClient, 'deepseek-chat', body.prompt, false)
    }

    const openAi = async () => {
      if (!openAiClient) {
        throw new Error('Missing OpenAI API key')
      }

      return requestProvider(openAiClient, 'gpt-4o-mini', body.prompt, true)
    }

    try {
      if (body.provider === 'deepseek') {
        return jsonResponse({
          ...aiResponseSchema.parse(normalizeAiPayload(await deepSeek())),
          providerUsed: 'deepseek',
        })
      }

      if (body.provider === 'openai') {
        return jsonResponse({
          ...aiResponseSchema.parse(normalizeAiPayload(await openAi())),
          providerUsed: 'openai',
        })
      }

      return jsonResponse({
        ...aiResponseSchema.parse(normalizeAiPayload(await deepSeek())),
        providerUsed: 'deepseek',
      })
    } catch (firstError) {
      if (body.provider === 'deepseek') {
        return jsonResponse({
          summary: 'DeepSeek request failed, deterministic fallback returned.',
          riskLevel: 'high',
          recommendedActions: [
            `Error: ${toErrorMessage(firstError)}`,
            'Review DeepSeek API key',
            'Verify DeepSeek base URL',
            'Try auto provider mode',
          ],
          providerUsed: 'none',
        })
      }

      try {
        return jsonResponse({
          ...aiResponseSchema.parse(normalizeAiPayload(await openAi())),
          providerUsed: 'openai',
        })
      } catch (secondError) {
        return jsonResponse({
          summary: 'All providers failed, deterministic fallback returned.',
          riskLevel: 'high',
          recommendedActions: [
            `DeepSeek/Error: ${toErrorMessage(firstError)}`,
            `OpenAI/Error: ${toErrorMessage(secondError)}`,
            'Review API credentials',
            'Verify provider base URLs',
            'Temporarily disable AI',
          ],
          providerUsed: 'none',
        })
      }
    }
  } catch (error) {
    return jsonResponse(
      {
        summary: 'Invalid request body for AI generation.',
        riskLevel: 'high',
        recommendedActions: [toErrorMessage(error), 'Validate prompt and provider fields'],
        providerUsed: 'none',
      },
      400,
    )
  }
}
