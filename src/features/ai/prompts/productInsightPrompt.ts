import type { ProductInsightInput } from '@/core/products/domain/ports/IAIService'

export const createProductInsightPrompt = (input: ProductInsightInput): string =>
  [
    'Eres un analista senior de producto.',
    'Responde en JSON corto con:',
    '- summary: analisis breve de compra/venta',
    '- riskLevel: low|medium|high',
    '- recommendedActions: arreglo de tres acciones',
    `Titulo: ${input.title}`,
    `Categoria: ${input.category}`,
    `Precio: ${input.price}`,
    `Descripcion: ${input.description}`,
  ].join('\n')
