# Architecture

## Feature-Sliced Design + Clean Architecture

This project adapts [Feature-Sliced Design (FSD)](https://feature-sliced.design) to Astro, aligned with [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) layers:

```
src/
├── app/          → FSD: App layer       → Clean Arch: App / Setup
├── pages/        → FSD: Pages           → Clean Arch: Presentation
├── features/     → FSD: Features        → Clean Arch: Application (use cases)
├── entities/     → FSD: Entities        → Clean Arch: Domain
├── shared/       → FSD: Shared          → Clean Arch: Infrastructure
└── content/      → FSD: Shared (data)   → Clean Arch: Infrastructure
```

### Clean Architecture mapping

| Clean Arch layer | FSD folder | Responsibility |
|---|---|---|
| **Domain** | `entities/` | Types, interfaces, business rules (Project, Post, Photo) |
| **Application** | `features/` | Use cases: list, filter, search, transform data |
| **Infrastructure** | `shared/` | UI primitives, i18n utils, helpers, repositories |
| **Presentation** | `pages/` + `app/` | Feature composition, layouts, Astro rendering |

### Dependency rule

```
┌─────────────────────────────┐
│       Presentation          │  pages/ + app/
│   (layouts, templates)      │
├─────────────────────────────┤
│       Application           │  features/
│   (use cases, features)     │
├─────────────────────────────┤
│        Domain               │  entities/
│   (entities, rules)         │
├─────────────────────────────┤
│     Infrastructure          │  shared/ + content/
│ (UI kit, i18n, repositories)│
└─────────────────────────────┘
```

**Outer layers may depend on inner layers, never the reverse.** Domain imports nothing from outside.

## Folder structure

```
src/
├── app/
│   ├── config/
│   │   ├── site.ts              # site metadata
│   │   └── i18n.ts              # locale config
│   ├── layouts/
│   │   ├── BaseLayout.astro     # global layout (nav, footer, SEO)
│   │   ├── BlogLayout.astro     # blog post layout
│   │   └── ProjectLayout.astro  # project page layout
│   └── styles/
│       └── globals.css          # Tailwind directives + resets
├── pages/
│   ├── index.astro              # landing page
│   ├── projects.astro           # project list
│   ├── blog/
│   │   ├── index.astro          # blog list
│   │   └── [slug].astro         # individual post
│   └── photos.astro             # photo gallery
├── features/
│   ├── blog/
│   │   ├── ui/                  # PostCard, PostList, PostHeader
│   │   └── api/                 # getPosts, getPostBySlug
│   ├── projects/
│   │   ├── ui/                  # ProjectCard, ProjectGrid, ProjectTechBadge
│   │   └── api/                 # getProjects
│   ├── photos/
│   │   ├── ui/                  # PhotoGrid, PhotoCard, Lightbox
│   │   └── api/                 # getPhotos
│   ├── i18n/
│   │   ├── ui/                  # LanguageSwitcher, LocaleText
│   │   └── lib/                 # translations dictionary
│   ├── mesh-background/
│   │   ├── MeshBackground.astro # Three.js particle background
│   │   └── meshBackground.ts    # particle system logic
│   └── ascii-art/
│       ├── AsciiArt.astro       # ASCII art component
│       └── asciiArt.ts          # ASCII conversion logic
├── entities/
│   ├── project/
│   │   ├── types.ts
│   │   └── project.schema.ts    # Zod validation (optional)
│   ├── post/
│   │   ├── types.ts
│   │   └── post.schema.ts
│   └── photo/
│       ├── types.ts
│       └── photo.schema.ts
├── shared/
│   ├── ui/                      # Button, Card, Tag, Container, Section, SEO, ThemeToggle
│   ├── lib/                     # i18n, formatters, utils
│   └── types/                   # page.ts, common.ts
├── content/
│   ├── blog/                    # .md/.mdx files
│   └── projects/                # .md/.mdx files
└── (outside src/)
    ├── tests/
    │   ├── setup.ts
    │   └── integration tests
    └── public/
        ├── favicon.ico
        └── images/
```

## Key decisions

- **Astro as SSG** — fully pre-rendered static output in `dist/`. No SSR hybrid.
- **No barrel files** — explicit imports only (no `index.ts` re-exports).
- **Feature colocation** — every feature is self-contained in `features/<name>/` with `ui/` (components) and `api/` (pure logic).
