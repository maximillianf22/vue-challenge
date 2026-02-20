# Product Architecture Skill

## Goal

Provide a repeatable checklist for product dashboard tasks with layered architecture and AI fallback.

## Expected structure

- `src/core`: entities, ports, pure use-cases.
- `src/features`: feature UI, composables, service orchestrators.
- `src/server`: BFF handlers and AI wrappers.
- `src/shared`: reusable UI and utilities.

## AI checklist

- Frontend calls BFF endpoint only.
- Validate AI output with `zod`.
- Support providers: `auto | deepseek | openai`.
- In `auto`, attempt DeepSeek before OpenAI.
- Always return deterministic fallback when providers fail.

## Quality checklist before commit

- Run `pnpm lint`.
- Run `pnpm test:unit`.
- Run `pnpm build`.
- Verify filters persist in URL.
- Verify detail page works with AI enabled and disabled.
