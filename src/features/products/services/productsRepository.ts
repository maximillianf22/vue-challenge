import type { Product, ProductFilters, ProductPage } from '@/core/products/domain/entities/Product'
import type { IProductsRepository } from '@/core/products/domain/ports/IProductsRepository'
import { fallbackProductsApi } from '@/features/products/services/fallbackProductsApi'
import { publicProductsApi } from '@/features/products/services/publicProductsApi'

const filterProducts = (items: Product[], filters: ProductFilters): Product[] => {
  return items.filter((item) => {
    const bySearch = item.title.toLowerCase().includes(filters.search.toLowerCase())
    return bySearch
  })
}

const paginate = (items: Product[], page: number, pageSize: number): ProductPage => {
  const total = items.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const safePage = Math.min(Math.max(page, 1), totalPages)
  const start = (safePage - 1) * pageSize
  const pageItems = items.slice(start, start + pageSize)

  return {
    items: pageItems,
    page: safePage,
    pageSize,
    total,
    totalPages,
  }
}

export class ProductsRepository implements IProductsRepository {
  async list(filters: ProductFilters): Promise<ProductPage> {
    let products: Product[]

    try {
      products =
        filters.category === 'all'
          ? await publicProductsApi.all()
          : await publicProductsApi.byCategory(filters.category)
    } catch {
      products = await fallbackProductsApi.all(filters.category)
    }

    return paginate(filterProducts(products, filters), filters.page, filters.pageSize)
  }

  async categories(): Promise<string[]> {
    try {
      const categories = await publicProductsApi.categories()
      return ['all', ...categories]
    } catch {
      return fallbackProductsApi.categories()
    }
  }

  async byId(id: number): Promise<Product> {
    try {
      const allProducts = await publicProductsApi.all()
      const fromAll = allProducts.find((item) => item.id === id)

      if (fromAll) {
        return fromAll
      }
    } catch {}

    const found = await fallbackProductsApi.one(id)

    if (!found) {
      throw new Error('Product not found')
    }

    return found
  }
}
