export interface ProductInsightInput {
  title: string
  description: string
  category: string
  price: number
  provider: 'auto' | 'deepseek' | 'openai'
}

export interface ProductInsightResult {
  summary: string
  riskLevel: 'low' | 'medium' | 'high'
  recommendedActions: string[]
  providerUsed: 'none' | 'deepseek' | 'openai'
}

export interface IAIService {
  generateInsight(input: ProductInsightInput): Promise<ProductInsightResult>
}
