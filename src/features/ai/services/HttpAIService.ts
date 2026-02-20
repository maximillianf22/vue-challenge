import { z } from 'zod'
import type {
  IAIService,
  ProductInsightInput,
  ProductInsightResult,
} from '@/core/products/domain/ports/IAIService'
import { createProductInsightPrompt } from '@/features/ai/prompts/productInsightPrompt'

const resultSchema = z.object({
  summary: z.string(),
  riskLevel: z.enum(['low', 'medium', 'high']),
  recommendedActions: z.array(z.string()),
  providerUsed: z.enum(['none', 'deepseek', 'openai']),
})

export class HttpAIService implements IAIService {
  async generateInsight(input: ProductInsightInput): Promise<ProductInsightResult> {
    const response = await fetch('/api/ai/generate', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        prompt: createProductInsightPrompt(input),
        provider: input.provider,
      }),
    })

    if (!response.ok) {
      throw new Error('No se pudo generar el analisis de IA')
    }

    const payload = await response.json()
    return resultSchema.parse(payload)
  }
}
