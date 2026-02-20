import {
  adaptFakeStoreCategories,
  adaptFakeStoreProduct,
  adaptFakeStoreProducts,
} from '@/features/products/adapters/productAdapter'
import { getJson } from '@/features/products/services/http'
import type { Product } from '@/core/products/domain/entities/Product'

const BASE_URL = 'https://fakestoreapi.com'

export const publicProductsApi = {
  async all(): Promise<Product[]> {
    const payload = await getJson<unknown>(`${BASE_URL}/products`)
    return adaptFakeStoreProducts(payload)
  },
  async byCategory(category: string): Promise<Product[]> {
    const encodedCategory = encodeURIComponent(category)
    const payload = await getJson<unknown>(`${BASE_URL}/products/category/${encodedCategory}`)
    return adaptFakeStoreProducts(payload)
  },
  async categories(): Promise<string[]> {
    const payload = await getJson<unknown>(`${BASE_URL}/products/categories`)
    return adaptFakeStoreCategories(payload)
  },
  async one(id: number): Promise<Product> {
    const payload = await getJson<unknown>(`${BASE_URL}/products/${id}`)
    return adaptFakeStoreProduct(payload)
  },
}
