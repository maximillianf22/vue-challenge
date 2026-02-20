import { z } from 'zod'
import type { Product } from '@/core/products/domain/entities/Product'

const fakeStoreProductSchema = z.object({
  id: z.number(),
  title: z.string(),
  price: z.number(),
  category: z.string(),
  description: z.string(),
  image: z.string(),
})

const fakeStoreCategoriesSchema = z.array(z.string())

export const adaptFakeStoreProducts = (payload: unknown): Product[] =>
  z.array(fakeStoreProductSchema).parse(payload)

export const adaptFakeStoreCategories = (payload: unknown): string[] =>
  fakeStoreCategoriesSchema.parse(payload)

export const adaptFakeStoreProduct = (payload: unknown): Product =>
  fakeStoreProductSchema.parse(payload)
