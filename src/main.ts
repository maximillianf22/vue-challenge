import { createApp } from 'vue'
import './style.css'
import 'vue-sonner/style.css'
import App from './App.vue'
import { router } from '@/router'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'

const bootstrap = async (): Promise<void> => {
  if (import.meta.env.DEV && import.meta.env.VITE_ENABLE_MSW === 'true') {
    const { worker } = await import('@/mocks/browser')
    await worker.start({ onUnhandledRequest: 'bypass' })
  } else if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations()
    await Promise.all(
      registrations
        .filter((registration) => registration.active?.scriptURL.includes('mockServiceWorker.js'))
        .map((registration) => registration.unregister()),
    )
  }

  const app = createApp(App)
  const queryClient = new QueryClient()

  app.use(router)
  app.use(VueQueryPlugin, { queryClient })
  app.mount('#app')
}

void bootstrap()
