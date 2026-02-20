<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { toast } from 'vue-sonner'
import Card from '@/components/ui/Card.vue'
import Skeleton from '@/components/ui/Skeleton.vue'
import Pagination from '@/components/ui/Pagination.vue'
import ProductsFilters from '@/features/products/components/ProductsFilters.vue'
import ProductsTable from '@/features/products/components/ProductsTable.vue'
import { useProductsFilters } from '@/features/products/composables/useProductsFilters'
import {
  useCategoriesQuery,
  useProductsQuery,
} from '@/features/products/composables/useProductsQuery'
import { useDebouncedValue } from '@/shared/composables/useDebouncedValue'

const { filters, updateFilters } = useProductsFilters()
const productsQuery = useProductsQuery(() => filters.value)
const categoriesQuery = useCategoriesQuery()

const searchText = ref(filters.value.search)
const debouncedSearch = useDebouncedValue(searchText, 400)

watch(
  () => filters.value.search,
  (value) => {
    if (value !== searchText.value) {
      searchText.value = value
    }
  },
)

watch(debouncedSearch, async (value) => {
  await updateFilters({ search: value, page: 1 })
})

watch(
  () => productsQuery.isError.value,
  (isError) => {
    if (isError) {
      toast.error('No se pudieron cargar los productos.')
    }
  },
)

watch(
  () => categoriesQuery.isError.value,
  (isError) => {
    if (isError) {
      toast.error('No se pudieron cargar las categorías.')
    }
  },
)

const categoryOptions = computed(() =>
  (categoriesQuery.data.value ?? ['all']).map((category) => ({
    value: category,
    label: category === 'all' ? 'Todas las categorías' : category,
  })),
)

const totalPages = computed(() => productsQuery.data.value?.totalPages ?? 1)

const onCategoryChange = async (category: string): Promise<void> => {
  await updateFilters({ category, page: 1 })
  toast.success('Filtro de categoría actualizado.')
}

const onSearchChange = (value: string): void => {
  searchText.value = value
}

const onPrevPage = async (): Promise<void> => {
  await updateFilters({ page: Math.max(1, filters.value.page - 1) })
  toast('Página anterior.')
}

const onNextPage = async (): Promise<void> => {
  await updateFilters({ page: Math.min(totalPages.value, filters.value.page + 1) })
  toast('Página siguiente.')
}
</script>

<template>
  <main class="mx-auto max-w-6xl space-y-5 p-6">
    <header class="space-y-1">
      <h1 class="text-2xl font-semibold text-slate-900">Panel de productos</h1>
      <p class="text-sm text-slate-600">
        Busca, filtra y navega productos con estado sincronizado en la URL.
      </p>
      <p class="text-sm text-slate-600">
        Desde el detalle de cada producto puedes generar un análisis con IA para evaluar riesgo y
        recomendaciones accionables.
      </p>
    </header>

    <Card class="space-y-4">
      <ProductsFilters
        :search="searchText"
        :category="filters.category"
        :categories="categoryOptions"
        @update:search="onSearchChange"
        @update:category="onCategoryChange"
      />

      <div v-if="productsQuery.isPending.value" class="space-y-2">
        <Skeleton class="h-10 w-full" />
        <Skeleton class="h-10 w-full" />
        <Skeleton class="h-10 w-full" />
      </div>
      <ProductsTable v-else :items="productsQuery.data.value?.items ?? []" />

      <Pagination
        :page="filters.page"
        :total-pages="totalPages"
        @prev="onPrevPage"
        @next="onNextPage"
      />
    </Card>
  </main>
</template>
