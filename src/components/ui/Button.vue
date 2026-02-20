<script setup lang="ts">
import BaseButton from '@/shared/ui/Button.vue'
</script>

<template>
  <BaseButton v-bind="$attrs">
    <slot />
  </BaseButton>
</template>
