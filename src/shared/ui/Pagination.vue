<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import Button from '@/shared/ui/Button.vue'

interface Props {
  page: number
  totalPages: number
}

defineProps<Props>()

const emit = defineEmits<{
  prev: []
  next: []
}>()
</script>

<template>
  <nav class="flex items-center justify-between gap-3" aria-label="Paginación">
    <Button variant="outline" :disabled="page <= 1" @click="emit('prev')">
      <ChevronLeft class="mr-1 h-4 w-4" />
      Anterior
    </Button>
    <p class="text-sm text-slate-600">Página {{ page }} / {{ totalPages }}</p>
    <Button variant="outline" :disabled="page >= totalPages" @click="emit('next')">
      Siguiente
      <ChevronRight class="ml-1 h-4 w-4" />
    </Button>
  </nav>
</template>
