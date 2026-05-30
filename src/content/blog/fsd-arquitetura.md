---
title: "Por que Escolhi Feature-Sliced Design para Meu Portfólio"
description: "Como a metodologia FSD ajuda a organizar projetos Astro de forma escalável e sustentável."
pubDate: 2026-05-20
tags: ["Arquitetura", "FSD", "Organização"]
draft: false
---

Manter um projeto organizado à medida que ele cresce é um desafio. Foi por isso que adotei o **Feature-Sliced Design (FSD)** neste portfólio.

## O que é FSD?

FSD é uma metodologia de organização de front-end que separa o código em camadas concêntricas:

```
┌─────────────────────────────┐
│       Presentation          │  pages/ + app/
├─────────────────────────────┤
│       Application           │  features/
├─────────────────────────────┤
│        Domain               │  entities/
├─────────────────────────────┤
│     Infrastructure          │  shared/ + content/
└─────────────────────────────┘
```

## Camadas

Cada camada tem uma responsabilidade clara:

- **App** — Configuração, layouts, estilos globais
- **Pages** — Composição de features para formar páginas
- **Features** — Casos de uso: listar posts, filtrar projetos
- **Entities** — Tipos e regras de negócio
- **Shared** — UI primitives, utilitários, i18n

## Regra de dependência

A regra mais importante: **camadas externas podem importar internas, nunca o contrário.**

Isso significa que `entities/` não importa nada de `features/`, e `features/` não importa nada de `pages/`.

## Por que funciona bem com Astro?

Astro incentiva componentes auto-contidos. Combinado com FSD, cada feature (como o background de mesh ou o blog) é completamente independente — tem seus componentes, lógica e estilos em um único lugar.

Para um portfólio que evolui, essa separação faz toda a diferença na hora de adicionar ou modificar funcionalidades sem quebrar o resto.
