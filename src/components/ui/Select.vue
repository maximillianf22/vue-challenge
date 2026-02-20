<script setup lang="ts">
import BaseSelect from '@/shared/ui/Select.vue'
import type { SelectOption } from '@/shared/ui/Select.vue'

interface Props {
  modelValue?: string
  options: SelectOption[]
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  class: '',
})

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <BaseSelect
    :model-value="props.modelValue"
    :options="props.options"
    :class="props.class"
    @update:model-value="$emit('update:modelValue', $event)"
  />
</template>
