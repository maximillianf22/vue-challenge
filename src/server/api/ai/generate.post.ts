import { z } from 'zod'
import { completeWithAi } from '../../utils/ai-chat'

const bodySchema = z.object({
  prompt: z.string().min(1),
  provider: z.enum(['auto', 'deepseek', 'openai']).default('auto'),
})

export const generateAiPayload = async (rawBody: unknown) => {
  const body = bodySchema.parse(rawBody)
  return completeWithAi(body)
}
