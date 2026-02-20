import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import { generateAiPayload } from './src/server/api/ai/generate.post'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  Object.assign(process.env, env)

  return {
    plugins: [
      vue(),
      tailwindcss(),
      {
        name: 'ai-api-dev',
        configureServer(server) {
          server.middlewares.use('/api/ai/generate', async (req, res, next) => {
            if (req.method !== 'POST') {
              next()
              return
            }

            let body = ''
            for await (const chunk of req) {
              body += String(chunk)
            }

            try {
              const payload = await generateAiPayload(JSON.parse(body || '{}'))
              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify(payload))
            } catch {
              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              res.end(
                JSON.stringify({
                  summary: 'Proveedor de IA no disponible. Se genero un fallback.',
                  riskLevel: 'medium',
                  recommendedActions: [
                    'Intentar mas tarde',
                    'Revisar credenciales del proveedor',
                    'Usar analisis manual',
                  ],
                  providerUsed: 'none',
                }),
              )
            }
          })
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  }
})
