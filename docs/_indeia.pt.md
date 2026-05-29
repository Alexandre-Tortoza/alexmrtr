# indeia — Alex Martins

> Guia de arquitetura, princípios e convenções do projeto.

## Stack

| Camada        | Tecnologia                                              |
| ------------- | ------------------------------------------------------- |
| Framework     | [Astro](https://astro.build) (SSG)                      |
| Estilização   | [Tailwind CSS](https://tailwindcss.com)                 |
| Conteúdo      | MDX local (`src/content/`)                              |
| Testes        | [Vitest](https://vitest.dev) + [Testing Library](https://testing-library.com) |
| i18n          | PT-BR + EN (custom, sem lib externa)                    |
| Deploy        | [Netlify](https://netlify.com)                          |

## Arquitetura

### Feature-Sliced Design (FSD) + Clean Architecture

Adaptação do FSD para Astro, alinhada às camadas da Clean Architecture:

```
src/
├── app/          → FSD: App layer       → Clean Arch: App / Setup
├── pages/        → FSD: Pages           → Clean Arch: Presentation
├── features/     → FSD: Features        → Clean Arch: Application (use cases)
├── entities/     → FSD: Entities        → Clean Arch: Domain
├── shared/       → FSD: Shared          → Clean Arch: Infrastructure
└── content/      → FSD: Shared (dados)  → Clean Arch: Infrastructure
```

#### Mapeamento Clean Architecture

| Camada Clean Arch | Pasta FSD   | Responsabilidade                                      |
| ----------------- | ----------- | ----------------------------------------------------- |
| **Domain**        | `entities/` | Tipos, interfaces, regras de negócio (Project, Post, Photo) |
| **Application**   | `features/` | Casos de uso: listar, filtrar, buscar, transformar dados |
| **Infrastructure** | `shared/`  | UI primitives, i18n utils, helpers, repositórios       |
| **Presentation**  | `pages/` + `app/` | Composição de features, layouts, renderização Astro |

### Clean Architecture em camadas

```
┌─────────────────────────────┐
│       Presentation          │  pages/ + app/
│   (layouts, templates)      │
├─────────────────────────────┤
│       Application           │  features/
│   (use cases, features)     │
├─────────────────────────────┤
│        Domain               │  entities/
│   (entidades, regras)       │
├─────────────────────────────┤
│     Infrastructure          │  shared/ + content/
│ (UI kit, i18n, repositórios)│
└─────────────────────────────┘
```

Regra de dependência: camadas externas podem depender de camadas internas, **nunca o contrário**. Domain não importa nada de fora.

---

## Estrutura de pastas

```
src/
├── app/
│   ├── config/
│   │   ├── site.ts              # metadados do site
│   │   └── i18n.ts              # locale config
│   ├── layouts/
│   │   ├── BaseLayout.astro     # layout global (nav, footer, SEO)
│   │   ├── BlogLayout.astro     # layout para posts
│   │   └── ProjectLayout.astro  # layout para projetos
│   └── styles/
│       └── globals.css          # Tailwind directives + resets
│
├── pages/
│   ├── index.astro              # Landing page
│   ├── projects.astro           # Lista de projetos
│   ├── blog/
│   │   ├── index.astro          # Lista de posts
│   │   └── [slug].astro         # Post individual
│   └── photos.astro             # Galeria de fotos
│
├── features/
│   ├── blog/
│   │   ├── ui/
│   │   │   ├── PostCard.astro
│   │   │   ├── PostList.astro
│   │   │   └── PostHeader.astro
│   │   └── api/
│   │       ├── getPosts.ts
│   │       └── getPostBySlug.ts
│   ├── projects/
│   │   ├── ui/
│   │   │   ├── ProjectCard.astro
│   │   │   ├── ProjectGrid.astro
│   │   │   └── ProjectTechBadge.astro
│   │   └── api/
│   │       └── getProjects.ts
│   ├── photos/
│   │   ├── ui/
│   │   │   ├── PhotoGrid.astro
│   │   │   ├── PhotoCard.astro
│   │   │   └── Lightbox.astro
│   │   └── api/
│   │       └── getPhotos.ts
│   └── i18n/
│       ├── ui/
│       │   ├── LanguageSwitcher.astro
│       │   └── LocaleText.tsx     # componente <T> para traduções
│       └── lib/
│           └── translations.ts    # dicionário pt/en
│
├── entities/
│   ├── project/
│   │   ├── types.ts
│   │   └── project.schema.ts     # validação (zod, opcional)
│   ├── post/
│   │   ├── types.ts
│   │   └── post.schema.ts
│   └── photo/
│       ├── types.ts
│       └── photo.schema.ts
│
├── shared/
│   ├── ui/
│   │   ├── Button.astro
│   │   ├── Card.astro
│   │   ├── Tag.astro
│   │   ├── Container.astro
│   │   ├── Section.astro
│   │   ├── SEO.astro
│   │   └── ThemeToggle.astro
│   ├── lib/
│   │   ├── i18n.ts               # hook/função t()
│   │   ├── formatters.ts         # datas, números locale-aware
│   │   └── utils.ts
│   └── types/
│       ├── page.ts               # PageMeta, SEOProps
│       └── common.ts             # genéricos (Locale, Pagination)
│
├── content/
│   ├── blog/
│   │   └── (arquivos .md/.mdx)
│   └── projects/
│       └── (arquivos .md/.mdx)
│
└── (fora de src/)
    ├── tests/
    │   ├── setup.ts
    │   └── (testes integração)
    └── public/
        ├── favicon.ico
        └── images/
```

---

## Princípios de código

### SOLID

| Letra | Princípio                    | Como aplicar                            |
| ----- | ---------------------------- | --------------------------------------- |
| **S** | Single Responsibility        | Cada componente/função faz **uma** coisa |
| **O** | Open/Closed                  | Props e slots pra estender, sem modificar |
| **L** | Liskov Substitution          | Subtipos substituem tipos base sem quebrar |
| **I** | Interface Segregation        | Interfaces pequenas e específicas        |
| **D** | Dependency Inversion         | Features dependem de abstrações (types), não de implementações concretas |

### KISS

> **Keep It Simple, Stupid.**

- Componentes pequenos (~50-100 linhas)
- Prefira `if` óbvio a um pattern engenhoso
- Astro `.astro` > JSX quando não precisar de interatividade

### YAGNI

> **You Ain't Gonna Need It.**

- Sem abstrações genéricas antes do 3º uso
- Sem hooks/libs pra problemas que não existem
- Pastas `api/` só existem quando há lógica extrair

### DRY

> **Don't Repeat Yourself.** Mas com parcimônia.

- Duplicação é aceitável temporariamente
- Extrair só quando o padrão se confirma (Rule of Three)
- Preferir composição a herança

### Clean Code

- Nomes que revelam intenção (`getPublishedPosts` > `getData`)
- Funções pequenas (máx ~20 linhas)
- Sem comentários que explicam *o que* (o código deve falar)
- Comentários só pra *porquê* (decisões, trade-offs)

---

## Metodologias

### TDD (Test-Driven Development)

```
[Red]   → Escreve teste que falha
[Green] → Implementa mínimo pra passar
[Refactor] → Melhora sem mudar comportamento
```

- Ciclo rápido: segundos/minutos por iteração
- Testes unitários pra `shared/lib` e `features/*/api`
- Testes de componente pra `shared/ui` e `features/*/ui`
- `vitest` + `@testing-library/astro` (ou jsdom)

### Práticas de XP (Extreme Programming)

- **Pequenas entregas** — cada PR cabe na cabeça de uma pessoa
- **Refactoring contínuo** — código limpo sempre, sem "depois a gente arruma"
- ** Propriedade coletiva** — qualquer pessoa pode mexer em qualquer parte
- **Integração contínua** — CI roda testes a cada push
- **Pair programming** — quando possível, colar pra revisar em tempo real
- **Coding standard** — este documento é a fonte da verdade

### Estratégia de Refactoring

- **Scout Rule**: deixe o acampamento mais limpo do que encontrou
- Se levar >10min, vira issue separada
- Testes primeiro, refactor depois

---

## Convenções

### Naming

| Contexto          | Padrão         | Exemplos                       |
| ----------------- | -------------- | ------------------------------ |
| Pastas            | `kebab-case`   | `blog/`, `photo-card/`         |
| Componentes Astro | `PascalCase`   | `PostCard.astro`               |
| Componentes JSX   | `PascalCase`   | `LocaleText.tsx`               |
| Funções           | `camelCase`    | `getPosts()`, `formatDate()`   |
| Tipos/Interfaces  | `PascalCase`   | `Project`, `PostCardProps`     |
| Arquivos de teste | `.test.ts`     | `getPosts.test.ts`             |

### Organização de features

Toda feature em `features/<nome>/` segue:

```
features/<nome>/
├── ui/        # Componentes visuais
└── api/       # Funções puras de dados (lógica de aplicação)
```

- `ui/` **não faz chamadas de dados**. Recebe tudo por props.
- `api/` **não tem JSX**. São funções puras que retornam dados.
- Essa separação mantém testabilidade e aderência ao SRP.

### Estilo de código

- Tipagem explícita sempre (strict mode)
- `import type` para tipos
- Preferir `const` a `let`
- Evitar `any` — usar `unknown` + narrowing
- Sem barril files (`index.ts` re-export) — import explícito

### Commits

Conventional Commits:

```
feat: adiciona galeria de fotos com lightbox
fix: corrige data errada no post [slug]
refactor: extrai PostCard de PostList
test: adiciona testes pra getPosts
docs: atualiza indeia.md com setup testing
```

### Branching

```
main          → produção
dev           → integração
feat/<nome>   → features novas
fix/<nome>    → correções
```

---

## i18n (PT-BR + EN)

- **Sem lib externa** — dicionário local em `shared/lib/i18n.ts`
- Chaves aninhadas: `blog.title.pt`, `blog.title.en`
- Componente `<T key="blog.title" />` renderiza texto do locale ativo
- Locale detectado por:
  1. Query param `?lang=en`
  2. Cookie `locale`
  3. Navegador (`Accept-Language`)
  4. Fallback: `pt`
- URL structure: `site.com/blog` (sem prefixo de locale — negociação via Accept-Language + cookie)

---

## Testes

### Setup

```
npm install -D vitest @testing-library/react jsdom
```

### O que testar

| Tipo                | O quê                                      |
| ------------------- | ------------------------------------------ |
| Unitários           | `shared/lib/*`, `features/*/api/*`         |
| Componentes         | `shared/ui/*`, `features/*/ui/*`           |
| Integração          | Fluxo página → feature → entity            |

### Cobertura inicial

- Funções `api/` — 100% (são puras, fáceis de testar)
- Componentes `ui/` — renderização básica e variações de props
- i18n — chaves existem pros dois locales

---

## Deploy (Netlify)

- `astro build` gera `dist/`
- Netlify detecta Astro automaticamente
- Redirects/Headers: `public/_redirects`
- Variáveis de ambiente no Netlify Dashboard
- Deploy automático nos pushes pra `main`

---

## Roadmap

```
🟢 Fase 1 — Setup (prioridade máxima)
  ├── Tailwind + globals.css
  ├── Vitest + testes de setup
  ├── i18n config + dicionário inicial
  └── Netlify config

🟡 Fase 2 — Shared UI primitives
  ├── Button, Card, Container, Section, SEO
  ├── tests de cada componente
  └── ThemeToggle

🟡 Fase 3 — Entities + Data layer
  ├── types: Project, Post, Photo
  ├── schemas de validação
  └── exemplo de conteúdo .mdx

🟠 Fase 4 — Features
  ├── blog (PostCard, PostList, api)
  ├── projects (ProjectCard, ProjectGrid, api)
  ├── photos (PhotoGrid, Lightbox, api)
  └── i18n (LanguageSwitcher, LocaleText)

🔵 Fase 5 — Pages
  ├── Landing (index.astro)
  ├── Projects
  ├── Blog (list + [slug])
  └── Photos

🟣 Fase 6 — Conteúdo + Testes
  ├── Postagens reais no blog
  ├── Projetos reais
  ├── Fotos
  └── Tests de integração

⚪ Fase 7 — Performance + SEO
  ├── Lighthouse audit
  ├── Open Graph tags
  ├── Sitemap
  └── RSS Feed
```

---

## Referências

- [Feature-Sliced Design docs](https://feature-sliced.design)
- [Clean Architecture (Robert C. Martin)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Astro docs](https://docs.astro.build)
- [Tailwind CSS docs](https://tailwindcss.com/docs)
- [Vitest](https://vitest.dev)
