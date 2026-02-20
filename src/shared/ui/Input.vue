<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/shared/lib/cn'

interface Props {
  modelValue?: string
  placeholder?: string
  type?: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '',
  type: 'text',
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

const onInput = (event: Event): void => {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>

<template>
  <input
    :value="modelValue"
    :placeholder="placeholder"
    :type="type"
    :class="classes"
    @input="onInput"
  />
</template>
