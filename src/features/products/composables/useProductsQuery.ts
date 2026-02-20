import { computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { ProductsRepository } from '@/features/products/services/productsRepository'
import {
  getProductById,
  listProductCategories,
  listProducts,
} from '@/core/products/application/useCases'
import type { ProductFilters } from '@/core/products/domain/entities/Product'

const repository = new ProductsRepository()

export const useProductsQuery = (filters: () => ProductFilters) =>
  useQuery({
    queryKey: computed(() => ['products', filters()]),
    queryFn: () => listProducts(repository, filters()),
  })

export const useCategoriesQuery = () =>
  useQuery({
    queryKey: ['products', 'categories'],
    queryFn: () => listProductCategories(repository),
  })

export const useProductQuery = (id: () => number) =>
  useQuery({
    queryKey: computed(() => ['products', 'detail', id()]),
    queryFn: () => getProductById(repository, id()),
  })
