import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { ProductFilters } from '@/core/products/domain/entities/Product'

const toNumber = (value: unknown, fallback: number): number => {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

export const useProductsFilters = () => {
  const route = useRoute()
  const router = useRouter()

  const filters = computed<ProductFilters>(() => ({
    search: String(route.query.search ?? ''),
    category: String(route.query.category ?? 'all'),
    page: toNumber(route.query.page, 1),
    pageSize: toNumber(route.query.pageSize, 8),
  }))

  const updateFilters = async (patch: Partial<ProductFilters>): Promise<void> => {
    await router.replace({
      query: {
        ...route.query,
        ...patch,
      },
    })
  }

  return {
    filters,
    updateFilters,
  }
}
