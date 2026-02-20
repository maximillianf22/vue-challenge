<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/shared/lib/cn'

interface Props {
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  class: '',
})

const classes = computed(() => cn('animate-pulse rounded-md bg-slate-200', props.class))
</script>

<template>
  <div :class="classes" />
</template>
