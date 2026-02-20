import { ref, watch, type Ref } from 'vue'

export const useDebouncedValue = (source: Ref<string>, delayMs = 350) => {
  const debounced = ref(source.value)
  let timeout: number | null = null

  watch(
    source,
    (value) => {
      if (timeout !== null) {
        window.clearTimeout(timeout)
      }

      timeout = window.setTimeout(() => {
        debounced.value = value
      }, delayMs)
    },
    { immediate: true },
  )

  return debounced
}
