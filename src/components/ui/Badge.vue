<script setup lang="ts">
import BaseBadge from '@/shared/ui/Badge.vue'
</script>

<template>
  <BaseBadge v-bind="$attrs">
    <slot />
  </BaseBadge>
</template>
