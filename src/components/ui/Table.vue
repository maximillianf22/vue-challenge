<script setup lang="ts">
import BaseTable from '@/shared/ui/Table.vue'
</script>

<template>
  <BaseTable v-bind="$attrs">
    <slot />
  </BaseTable>
</template>
