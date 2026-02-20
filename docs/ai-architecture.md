# Arquitectura de IA

## Flujo general

1. La vista de detalle de producto solicita el análisis.
2. `HttpAIService` envía la solicitud a `/api/ai/generate`.
3. El backend/function ejecuta la estrategia de proveedor.
4. La respuesta se normaliza y valida con `zod`.
5. Si todos los proveedores fallan, se retorna fallback determinístico.

## Estrategia de proveedores

- `deepseek`: usa solo DeepSeek.
- `openai`: usa solo OpenAI.
- `auto`: intenta DeepSeek primero y OpenAI como fallback.

## Contrato de entrada/salida

- Entrada:
  - `prompt`
  - `provider` (`auto|deepseek|openai`)
- Salida:
  - `summary`
  - `riskLevel` (`low|medium|high`)
  - `recommendedActions` (`string[]`)
  - `providerUsed` (`none|deepseek|openai`)

## Entornos de ejecución

- Desarrollo local:
  - Endpoint servido desde middleware en `vite.config.ts`.
- Producción (Netlify):
  - Endpoint servido por `netlify/functions/ai-generate.mjs`.
  - Redirect desde `/api/ai/generate` hacia `/.netlify/functions/ai-generate`.

## Validación y resiliencia

- Validación de body de entrada con `zod`.
- Validación de respuesta del proveedor con schema estricto.
- Normalización de payload para tolerar diferencias menores de formato.
- Fallback determinístico con mensajes de diagnóstico.

## Seguridad

- Las API keys nunca se exponen en frontend.
- Uso de variables de entorno en runtime server-side/function.
- Posibilidad de desactivar IA globalmente con `ENABLE_AI=false`.

## Límites actuales

- No hay persistencia de resultados de análisis.
- No hay rate limit ni cache por usuario.
- El prompt puede endurecerse más con guardrails adicionales.
