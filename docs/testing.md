# Testing

## TDD (Test-Driven Development)

```
[Red]     → Write a failing test
[Green]   → Implement the minimum to pass
[Refactor] → Improve without changing behavior
```

Fast cycle: seconds/minutes per iteration.

## What to test

| Type | What |
|---|---|
| Unit | `shared/lib/*`, `features/*/api/*` |
| Component | `shared/ui/*`, `features/*/ui/*` |
| Integration | Page → feature → entity flow |

## Setup

```bash
pnpm add -D vitest @testing-library/astro jsdom
```

## Coverage targets

- `api/` functions — 100% (pure functions, easy to test)
- `ui/` components — basic rendering + prop variations
- i18n — all translation keys exist for both locales
