<script setup lang="ts">
import { computed, ref } from 'vue'
import { Loader2, Sparkles } from 'lucide-vue-next'
import { useRoute } from 'vue-router'
import { useProductQuery } from '@/features/products/composables/useProductsQuery'
import { toast } from 'vue-sonner'
import Card from '@/components/ui/Card.vue'
import Badge from '@/components/ui/Badge.vue'
import Button from '@/components/ui/Button.vue'
import Select from '@/components/ui/Select.vue'
import Skeleton from '@/components/ui/Skeleton.vue'
import { HttpAIService } from '@/features/ai/services/HttpAIService'
import type { ProductInsightResult } from '@/core/products/domain/ports/IAIService'

const route = useRoute()
const id = computed(() => Number(route.params.id))
const productQuery = useProductQuery(() => id.value)

const aiService = new HttpAIService()
const aiProvider = ref<'auto' | 'deepseek' | 'openai'>('auto')
const aiInsight = ref<ProductInsightResult | null>(null)
const aiLoading = ref(false)

const providerOptions = [
  { label: 'Automático', value: 'auto' },
  { label: 'DeepSeek', value: 'deepseek' },
  { label: 'OpenAI', value: 'openai' },
]

const onProviderChange = (value: string): void => {
  if (value === 'auto' || value === 'deepseek' || value === 'openai') {
    aiProvider.value = value
    toast.success(`Proveedor de IA seleccionado: ${value}.`)
    return
  }

  toast.error('Proveedor de IA inválido.')
}

const generateInsight = async (): Promise<void> => {
  if (!productQuery.data.value) {
    return
  }

  aiLoading.value = true
  toast('Generando análisis del producto...')

  try {
    aiInsight.value = await aiService.generateInsight({
      title: productQuery.data.value.title,
      description: productQuery.data.value.description,
      category: productQuery.data.value.category,
      price: productQuery.data.value.price,
      provider: aiProvider.value,
    })
    if (aiInsight.value.providerUsed === 'none') {
      toast.error(
        'La IA está deshabilitada o falló el proveedor. Revisa ENABLE_AI y las llaves del proveedor.',
      )
      return
    }

    toast.success(`Análisis generado con ${aiInsight.value.providerUsed}.`)
  } catch {
    toast.error('No se pudo generar el análisis.')
  } finally {
    aiLoading.value = false
  }
}
</script>

<template>
  <main class="mx-auto max-w-4xl space-y-5 p-6">
    <RouterLink class="inline-flex text-sm text-slate-600 hover:text-slate-900" to="/products">
      ← Volver a productos
    </RouterLink>

    <Card v-if="productQuery.isPending.value" class="space-y-3">
      <Skeleton class="h-8 w-2/3" />
      <Skeleton class="h-6 w-1/3" />
      <Skeleton class="h-24 w-full" />
    </Card>

    <Card v-else-if="productQuery.data.value" class="space-y-4">
      <header class="space-y-2">
        <h1 class="text-2xl font-semibold">{{ productQuery.data.value.title }}</h1>
        <div class="flex items-center gap-3">
          <Badge>{{ productQuery.data.value.category }}</Badge>
          <p class="font-medium">${{ productQuery.data.value.price.toFixed(2) }}</p>
        </div>
      </header>

      <div class="grid gap-4 md:grid-cols-[180px_1fr]">
        <img
          :src="productQuery.data.value.image"
          :alt="productQuery.data.value.title"
          class="h-44 w-full rounded-md border border-slate-200 object-contain bg-white p-3"
        />
        <p class="text-slate-700">{{ productQuery.data.value.description }}</p>
      </div>

      <section class="space-y-3 rounded-md border border-slate-200 bg-slate-50 p-4">
        <h2 class="text-lg font-medium">Análisis de IA</h2>
        <p class="text-sm text-slate-600">
          Esta sección genera una lectura rápida del producto con un resumen, nivel de riesgo y
          acciones recomendadas.
        </p>
        <p class="text-sm text-slate-600">
          Selecciona el proveedor y pulsa
          <strong>Generar análisis</strong> para obtener apoyo en decisiones de catálogo,
          priorización comercial y revisión de calidad de información.
        </p>
        <div class="flex flex-col gap-3 md:flex-row">
          <Select
            :model-value="aiProvider"
            :options="providerOptions"
            @update:model-value="onProviderChange"
          />
          <Button
            :disabled="aiLoading"
            class="min-w-[170px] whitespace-nowrap"
            @click="generateInsight"
          >
            <Loader2 v-if="aiLoading" class="mr-1 h-4 w-4 animate-spin" />
            <Sparkles v-else class="mr-1 h-4 w-4" />
            {{ aiLoading ? 'Generando...' : 'Generar análisis' }}
          </Button>
        </div>

        <div v-if="aiInsight" class="space-y-2 rounded-md bg-white p-3">
          <p class="text-sm"><strong>Proveedor:</strong> {{ aiInsight.providerUsed }}</p>
          <p class="text-sm"><strong>Nivel de riesgo:</strong> {{ aiInsight.riskLevel }}</p>
          <p class="text-sm">{{ aiInsight.summary }}</p>
          <ul class="list-inside list-disc text-sm text-slate-700">
            <li v-for="action in aiInsight.recommendedActions" :key="action">{{ action }}</li>
          </ul>
        </div>
      </section>
    </Card>
  </main>
</template>
