# Decisiones Técnicas

## Por qué repositorio + adaptador

- Mantiene el dominio desacoplado de contratos externos.
- Permite cambiar proveedor/fuente de datos sin modificar la UI.
- Facilita fallback de API y mocks de forma controlada.

## Por qué Vue Query

- Estandariza estados de carga, error y reintento.
- Simplifica cache de estado de servidor.
- Reduce lógica duplicada en componentes.

## Por qué Tailwind + UI compartida

- Acelera implementación manteniendo consistencia visual.
- Promueve reutilización de primitivas (`Button`, `Input`, `Select`, `Table`, etc.).
- Facilita ajustes globales de estilos.

## Por qué BFF/Function para IA

- Protege credenciales de proveedores.
- Centraliza estrategia de fallback.
- Permite validar y normalizar respuestas antes de llegar al frontend.

## Buenas prácticas adoptadas

- Tipado estricto con TypeScript.
- Validación de datos con `zod` en fronteras del sistema.
- Calidad continua con ESLint y Prettier.
- Automatización de checks con Husky + lint-staged.
- Cobertura base con pruebas unitarias y e2e.
- Variables sensibles fuera de git (`.env`).

## Trade-offs

- Mayor cantidad de archivos y configuración que un challenge básico.
- Curva inicial más alta para nuevos contribuidores.
- Mejor mantenibilidad y escalabilidad a mediano plazo.
