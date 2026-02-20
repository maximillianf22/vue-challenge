<script setup lang="ts">
import BaseCard from '@/shared/ui/Card.vue'
</script>

<template>
  <BaseCard v-bind="$attrs">
    <slot />
  </BaseCard>
</template>
