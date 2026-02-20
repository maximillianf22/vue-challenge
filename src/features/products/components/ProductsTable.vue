<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Eye } from 'lucide-vue-next'
import type { Product } from '@/core/products/domain/entities/Product'
import Badge from '@/components/ui/Badge.vue'
import Button from '@/components/ui/Button.vue'
import Table from '@/components/ui/Table.vue'

interface Props {
  items: Product[]
}

defineProps<Props>()
</script>

<template>
  <Table>
    <thead class="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
      <tr>
        <th class="px-4 py-3">Título</th>
        <th class="px-4 py-3">Categoría</th>
        <th class="px-4 py-3">Precio</th>
        <th class="px-4 py-3">Acciones</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-slate-200 bg-white">
      <tr v-for="item in items" :key="item.id">
        <td class="px-4 py-3 font-medium text-slate-800">{{ item.title }}</td>
        <td class="px-4 py-3">
          <Badge>{{ item.category }}</Badge>
        </td>
        <td class="px-4 py-3">${{ item.price.toFixed(2) }}</td>
        <td class="px-4 py-3">
          <RouterLink :to="`/products/${item.id}`">
            <Button size="sm" variant="outline">
              <Eye class="mr-1 h-4 w-4" />
              Ver detalle
            </Button>
          </RouterLink>
        </td>
      </tr>
    </tbody>
  </Table>
</template>
