# Dashboard Productos Senior

Dashboard de productos con Vue 3 + TypeScript, arquitectura por capas y fallback de IA DeepSeek -> OpenAI desde BFF.

## Setup

```bash
pnpm install
cp .env.example .env
pnpm dev
```

## Scripts

- `pnpm dev`: servidor de desarrollo.
- `pnpm lint`: linting.
- `pnpm test:unit`: pruebas unitarias.
- `pnpm test:e2e`: pruebas e2e.
- `pnpm build`: typecheck y build de producción.

## Alcance implementado (entrega express)

- Listado de productos.
- Búsqueda por nombre con debounce y sincronización en URL.
- Filtro por categoría.
- Paginación.
- Vista de detalle.
- Capa de datos híbrida con fallback y soporte MSW en desarrollo.

## Arquitectura

- `src/core`: entidades, puertos y casos de uso.
- `src/features/products`: UI, composables y repositorio de productos.
- `src/features/ai`: prompts y cliente de IA.
- `src/server`: wrapper BFF para IA.
- `src/shared`: librería UI base y utilidades.

## IA (`auto | deepseek | openai`)

- El frontend usa `HttpAIService` y llama endpoint BFF (`/api/ai/generate`).
- El wrapper server-side intenta DeepSeek primero y OpenAI después en modo `auto`.
- La salida se valida con `zod`.
- Si IA está desactivada o falla, se responde con fallback determinístico.
- Para demo estable de entrega rápida usar `VITE_ENABLE_AI=false` y `ENABLE_AI=false`.

## Seguridad y fallback

- No se expone API key LLM en frontend.
- Feature flags:
  - `VITE_ENABLE_AI`
  - `ENABLE_AI`
- Modo mock opcional con `VITE_ENABLE_MSW=true`.
- El archivo `.env` está ignorado por git; usa `.env.example` como base local.
