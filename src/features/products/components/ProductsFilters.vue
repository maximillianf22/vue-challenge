<script setup lang="ts">
import Input from '@/components/ui/Input.vue'
import Select from '@/components/ui/Select.vue'
import type { SelectOption } from '@/shared/ui/Select.vue'

interface Props {
  search: string
  category: string
  categories: SelectOption[]
}

defineProps<Props>()

const emit = defineEmits<{
  'update:search': [value: string]
  'update:category': [value: string]
}>()
</script>

<template>
  <section class="grid gap-3 md:grid-cols-2">
    <Input
      :model-value="search"
      placeholder="Buscar productos por nombre..."
      aria-label="Buscar productos"
      @update:model-value="emit('update:search', $event)"
    />
    <Select
      :model-value="category"
      :options="categories"
      aria-label="Filtrar por categoría"
      @update:model-value="emit('update:category', $event)"
    />
  </section>
</template>
