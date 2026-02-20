# Dashboard de Productos (Senior Challenge)

Aplicación de dashboard construida con Vue 3 + TypeScript, arquitectura por capas y consumo de `Fake Store API` para productos.

Incluye módulo de análisis con IA mediante una capa BFF/Function para evitar exponer llaves en frontend.

## Requisitos

- Node.js 20+
- pnpm 9+

## Configuración local

```bash
pnpm install
cp .env.example .env
pnpm dev
```

## Scripts disponibles

- `pnpm dev`: servidor de desarrollo.
- `pnpm lint`: validación de estilo y calidad con ESLint.
- `pnpm lint:fix`: correcciones automáticas de ESLint.
- `pnpm format`: verificación de formato con Prettier.
- `pnpm format:write`: formateo automático con Prettier.
- `pnpm test:unit`: pruebas unitarias con Vitest.
- `pnpm test:e2e`: pruebas e2e con Playwright.
- `pnpm build`: typecheck (`vue-tsc`) + build de producción.

## Alcance funcional

- Listado de productos.
- Búsqueda por nombre con debounce y sincronización en URL.
- Filtro por categoría.
- Paginación.
- Vista de detalle de producto.
- Generación de análisis con IA por proveedor (`auto`, `deepseek`, `openai`).
- Fallback determinístico cuando falla IA.

## Estructura de arquitectura

- `src/core`: entidades, puertos y casos de uso.
- `src/features/products`: UI, composables, adaptadores y repositorio.
- `src/features/ai`: prompts y cliente HTTP para IA.
- `src/server`: lógica server-side reutilizable para IA (modo desarrollo).
- `src/shared`: componentes base y utilidades compartidas.
- `netlify/functions`: funciones serverless para producción en Netlify.

## IA en desarrollo y producción

- Frontend: usa `HttpAIService` llamando `/api/ai/generate`.
- Desarrollo local: endpoint servido por middleware de Vite.
- Producción (Netlify): endpoint resuelto por `/.netlify/functions/ai-generate`.
- Estrategia `auto`: intenta DeepSeek y luego OpenAI.
- Validación de entrada/salida con `zod`.

## Variables de entorno clave

- `VITE_ENABLE_AI`: habilita/deshabilita UI de IA en frontend.
- `ENABLE_AI`: habilita/deshabilita ejecución real de proveedores en backend/function.
- `DEEP_SEEK_API_KEY`, `DEEP_SEEK_BASE_URL`
- `OPEN_AI_API_KEY`, `OPEN_AI_BASE_URL`
- `VITE_ENABLE_MSW`: habilita mocks con MSW en desarrollo.

## Deploy en Netlify

- Se usa redirect SPA para Vue Router:
  - `/* /index.html 200`
- Se redirige API de IA a Function:
  - `/api/ai/generate /.netlify/functions/ai-generate 200`
- Configuración en:
  - `public/_redirects`
  - `netlify.toml`

## Buenas prácticas implementadas

- Arquitectura por capas y separación de responsabilidades.
- Contratos tipados en dominio y adaptadores para datos externos.
- Validación robusta con `zod` para evitar errores silenciosos.
- ESLint + Prettier para consistencia de código.
- `husky` + `lint-staged` para checks automáticos antes de commit.
- Pruebas unitarias y e2e como base de regresión.
- Secrets fuera de repositorio (`.env` ignorado por git).
