# alexmrtr — Docs

Personal portfolio for Alexandre Tortoza. Built with Astro, Tailwind CSS v4, Three.js, and GSAP.

## Quick navigation

| Document | What it covers |
|---|---|
| [Architecture](./architecture.md) | Feature-Sliced Design + Clean Architecture, dependency rule, folder map |
| [Principles](./principles.md) | SOLID, KISS, YAGNI, DRY, Clean Code |
| [Conventions](./conventions.md) | Naming, feature org (`ui/` + `api/`), TS style, commits, branching |
| [Stack](./stack.md) | Every dependency: version, purpose, official docs link, common commands |
| [Testing](./testing.md) | TDD, Vitest setup, what to test, coverage targets |
| [i18n](./i18n.md) | Custom dictionary, locale detection, `<T>` component |
| [Deploy](./deploy.md) | Netlify: build, redirects, env vars |
| [Roadmap](./roadmap.md) | 7 development phases with priorities |

## Project at a glance

```
alexmrtr/
├── src/
│   ├── app/          → global layout, styles, config
│   ├── pages/        → route pages (index, projects, blog, photos)
│   ├── features/     → domain features (blog, projects, photos, i18n, mesh-background, ascii-art)
│   ├── entities/     → domain types (Project, Post, Photo)
│   └── shared/       → UI primitives, lib utils, common types
├── docs/             → architectural docs (you are here)
├── public/           → static assets
└── tests/            → Vitest suite
```

> **Note:** The original Portuguese architecture guide is preserved at [`_indeia.pt.md`](./_indeia.pt.md).
