# Guía de Contribución

## Flujo de ramas

- Crear ramas de trabajo desde `main`.
- Preferir PRs pequeñas y enfocadas en un solo objetivo.

## Estilo de commits

- Se usa convención de commits (Conventional Commits).
- Validación automática con commitlint.
- Ejemplo: `feat(products): add url synced filters`

## Estándares de calidad

- ESLint obligatorio antes de merge.
- Prettier para mantener formato consistente.
- Tipado y typecheck en build (`vue-tsc`).
- Evitar mezclar cambios funcionales con cambios de formato no relacionados.

## Hooks y automatización local

- Husky ejecuta hooks de git.
- lint-staged corre validaciones sobre archivos staged.
- Objetivo: detectar errores temprano y reducir ruido en PR.

## Checklist de Pull Request

- [ ] `pnpm lint`
- [ ] `pnpm format`
- [ ] `pnpm test:unit`
- [ ] `pnpm build`
- [ ] Documentación actualizada si cambió arquitectura o comportamiento
- [ ] Flujo de productos validado manualmente (listado, filtros, paginación, detalle)
- [ ] Flujo de IA validado (si aplica): generación exitosa o fallback controlado
