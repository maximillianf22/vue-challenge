<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/shared/lib/cn'

interface Props {
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  class: '',
})

const classes = computed(() =>
  cn(
    'inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700',
    props.class,
  ),
)
</script>

<template>
  <span :class="classes">
    <slot />
  </span>
</template>
