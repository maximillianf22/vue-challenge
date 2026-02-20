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
  cn('rounded-lg border border-slate-200 bg-white p-4 shadow-sm', props.class),
)
</script>

<template>
  <article :class="classes">
    <slot />
  </article>
</template>
