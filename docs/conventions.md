# Conventions

## Naming

| Context | Pattern | Examples |
|---|---|---|
| Directories | `kebab-case` | `blog/`, `ascii-art/` |
| Astro components | `PascalCase` | `PostCard.astro` |
| JSX/TSX components | `PascalCase` | `LocaleText.tsx` |
| Functions | `camelCase` | `getPosts()`, `formatDate()` |
| Types/Interfaces | `PascalCase` | `Project`, `PostCardProps` |
| Test files | `.test.ts` | `getPosts.test.ts` |

## Feature organization

Every feature in `features/<name>/` follows:

```
features/<name>/
├── ui/        # visual components
└── api/       # pure data functions (application logic)
```

- `ui/` **makes no data calls** — receives everything via props.
- `api/` **has no JSX** — pure functions that return data.
- This separation keeps testability high and adheres to SRP.

## Code style

- Explicit typing always (strict mode)
- `import type` for type-only imports
- Prefer `const` over `let`
- Avoid `any` — use `unknown` + narrowing
- No barrel files (`index.ts` re-exports) — explicit imports only

## Commits

Conventional Commits format:

```
feat: add photo gallery with lightbox
fix: fix wrong date on post [slug]
refactor: extract PostCard from PostList
test: add tests for getPosts
docs: update setup guide
```

## Branching

```
main          → production
dev           → integration
feat/<name>   → new features
fix/<name>    → bug fixes
```
