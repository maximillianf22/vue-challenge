# AI Architecture

## Flow

1. Product detail page requests insight.
2. `HttpAIService` sends request to `/api/ai/generate`.
3. BFF wrapper `completeWithAi` chooses provider strategy.
4. Response is validated with `zod`.
5. If all providers fail, deterministic fallback is returned.

## Provider strategy

- `deepseek`: only DeepSeek.
- `openai`: only OpenAI.
- `auto`: DeepSeek first, OpenAI fallback.

## Contracts

- Input: `prompt`, `provider`.
- Output:
  - `summary`
  - `riskLevel` (`low|medium|high`)
  - `recommendedActions` (`string[]`)
  - `providerUsed` (`none|deepseek|openai`)

## Known limitations

- Endpoint file is framework-agnostic and should be mapped to the server runtime used in deployment.
- Prompt hardening can be expanded with stricter schemas and moderation.
