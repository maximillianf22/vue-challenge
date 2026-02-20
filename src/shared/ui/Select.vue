<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/shared/lib/cn'

export interface SelectOption {
  label: string
  value: string
}

interface Props {
  modelValue?: string
  options: SelectOption[]
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  class: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const classes = computed(() =>
  cn(
    'h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-offset-white transition focus-visible:ring-2 focus-visible:ring-slate-500',
    props.class,
  ),
)

const onChange = (event: Event): void => {
  emit('update:modelValue', (event.target as HTMLSelectElement).value)
}
</script>

<template>
  <select :value="modelValue" :class="classes" @change="onChange">
    <option v-for="option in options" :key="option.value" :value="option.value">
      {{ option.label }}
    </option>
  </select>
</template>
