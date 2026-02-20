<script setup lang="ts">
import BasePagination from '@/shared/ui/Pagination.vue'

interface Props {
  page: number
  totalPages: number
}

const props = defineProps<Props>()

defineEmits<{
  prev: []
  next: []
}>()
</script>

<template>
  <BasePagination
    :page="props.page"
    :total-pages="props.totalPages"
    @prev="$emit('prev')"
    @next="$emit('next')"
  />
</template>
