import type { ProductFilters } from '@/core/products/domain/entities/Product'
import type { IProductsRepository } from '@/core/products/domain/ports/IProductsRepository'

export const listProducts = (repository: IProductsRepository, filters: ProductFilters) => repository.list(filters)

export const listProductCategories = (repository: IProductsRepository) => repository.categories()

export const getProductById = (repository: IProductsRepository, id: number) => repository.byId(id)
