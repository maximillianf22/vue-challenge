# Technical Decisions

## Why repository + adapter

- Keeps domain independent from external API contracts.
- Enables API fallback and deterministic mocks without changing UI.

## Why Vue Query

- Server state caching, retries and loading/error states are standardized.

## Why Tailwind + shared UI components

- Fast implementation with consistency.
- Reusable primitives (`Button`, `Input`, `Select`, `Table`, etc.).

## Why BFF for IA

- Protects provider keys.
- Centralizes fallback logic and output validation.

## Trade-offs

- More files and structure than a basic challenge.
- Higher setup cost, but easier maintenance and extension.
