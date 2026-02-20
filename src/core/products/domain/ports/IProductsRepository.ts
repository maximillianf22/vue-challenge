import type { Product, ProductFilters, ProductPage } from '@/core/products/domain/entities/Product'

export interface IProductsRepository {
  list(filters: ProductFilters): Promise<ProductPage>
  categories(): Promise<string[]>
  byId(id: number): Promise<Product>
}
