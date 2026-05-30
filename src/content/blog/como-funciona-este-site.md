---
title: "Como Este Site Funciona"
description: "Uma visão geral da arquitetura, stack e decisões de design por trás deste portfólio."
pubDate: 2026-05-30
tags: ["Astro", "Arquitetura", "FSD", "Three.js", "GSAP", "Tailwind"]
draft: false
---

Este post é uma visita guiada pelo código-fonte deste site. Vou explicar a stack, a arquitetura, as features visuais e as decisões de design que moldaram o projeto.

---

## Stack

| Tecnologia | Uso |
|---|---|
| **Astro** | SSG — geração estática, zero JS por padrão |
| **Tailwind CSS v4** | Estilização utilitária, `@theme` com cores customizadas |
| **Three.js** | Background 3D de partículas (MeshBackground) |
| **GSAP** | Animações suaves, ticker de interpolação, scroll-trigger |
| **TypeScript** | Tipagem estrita em todo o código |

Tudo roda em `pnpm dev` para desenvolvimento e `pnpm build` gera `dist/` estático.

---

## Arquitetura: Feature-Sliced Design

O projeto segue [Feature-Sliced Design (FSD)](https://feature-sliced.design) combinado com Clean Architecture. A estrutura de pastas reflete camadas concêntricas:

```
src/
├── app/          → Config, layouts, estilos globais
├── pages/        → Rotas (cada arquivo .astro vira uma URL)
├── features/     → Casos de uso auto-contidos
├── entities/     → Tipos de domínio
└── content/      → Posts em markdown
```

A regra de ouro: **camadas externas importam internas, nunca o contrário.** Uma feature nunca importa uma página. Uma entidade nunca importa uma feature.

### Exemplo na prática

O blog está organizado assim:

```
entities/post/types.ts           → interface PostMeta (domínio)
features/blog/api/posts.ts       → getPosts(), getPostBySlug() (caso de uso)
features/blog/ui/PostCard.astro  → componente de card (apresentação)
pages/blog/index.astro            → página de listagem
pages/blog/[slug].astro           → página individual
```

Cada peça tem uma responsabilidade única e pode ser testada, modificada ou substituída isoladamente.

---

## Features Visuais

### MeshBackground (Three.js)

O fundo de partículas é um sistema de pontos em grid 3D:

```typescript
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(totalPoints * 3);

// Cada ponto tem posição, cor e tamanho armazenados em buffers
```

As partículas ondulam com ondas senoidais e reagem ao mouse — as mais próximas do cursor aumentam de brilho e tamanho. A câmera segue o mouse com interpolação suave via `gsap.ticker`.

Seis cores da paleta `mesh-1` a `mesh-6` (`#1EA7B6`, `#2E828B`, `#00CAE1`, `#305C61`, `#243536`, `#2B3233`) são distribuídas aleatoriamente entre os pontos.

### Stardust (Canvas 2D + GSAP)

Uma segunda camada de background é um **túnel de estrelas** em 3D projetado em Canvas 2D:

- **600 partículas** em espaço 3D que se movem em direção ao observador
- **Projeção perspectiva** — coordenadas 3D são projetadas em 2D com `scale = fov / z`
- **Três cores** — `#1EA7B6` (ciano), `#FFFFFF` (branco), `#B489D1` (roxo)
- **Streaks de movimento** — cada partícula desenha uma linha da posição anterior para a atual, criando rastros
- **GSAP ticker** — `gsap.ticker.add(draw)` mantém o loop de animação sincronizado com o resto do site
- **Tail effect** — `ctx.fillStyle = "rgba(10, 10, 10, 0.4)"` apaga gradualmente o frame anterior, suavizando os rastros

### BinaryStars (AboutBackground)

Na seção Sobre, um canvas 2D exibe caracteres `0` e `1` que piscam como estrelas binárias — uma referência sutil ao tema de tecnologia.

### Galeria (PhotoCard + ASCII preview)

A página `/photos` exibe uma galeria de fotos com um mecanismo de revelação:

- **Prévia em ASCII** — cada foto é inicialmente mostrada como arte ASCII gerada com `asciify-engine`
- **Click to unlock** — ao clicar, a imagem real é revelada com transição suave
- **Dados em JSON** — as fotos são definidas em `features/gallery/data/photos.json`
- **Grid responsivo** — layout adaptável que funciona em mobile e desktop

---

## Sistema de Design

### Cores

```css
@theme {
  --color-mesh-1: #1ea7b6;  /* ciano principal */
  --color-mesh-2: #2e828b;
  --color-mesh-3: #00cae1;
  --color-mesh-4: #305c61;
  --color-mesh-5: #243536;
  --color-mesh-6: #2b3233;
}
```

O tema escuro (`bg-primary: #0a0a0a`) é o padrão. O tema claro alterna para fundo claro mantendo o mesmo acento ciano.

### Tipografia

JetBrains Mono como fonte principal — monospace ao longo de todo o site, reforçando a estética de desenvolvedor.

### Glassmorphism

Cards e containers usam o padrão:

```css
border-white/5 bg-white/[0.03] backdrop-blur-md
```

Isso cria o efeito de vidro fosco que aparece nas seções Sobre, Skills e nos cards do blog.

---

## Content Collections (Blog)

Os posts são gerenciados via Content Collections do Astro com schema validado por Zod:

```typescript
const blog = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});
```

Para renderizar um post, usa-se `render(entry)` do `astro:content`:

```typescript
import { getCollection, render } from "astro:content";

const entries = await getCollection("blog");
const { Content } = await render(entry);
```

Posts marcados como `draft: true` não aparecem em produção — útil para rascunhos.

---

## Princípios de Código

O projeto segue alguns princípios simples:

- **Componentes pequenos** — ~50–100 linhas, uma responsabilidade cada
- **Sem barrel files** — imports explícitos de cada arquivo
- **DRY com cautela** — duplicação é aceitável temporariamente; extrair só na 3ª repetição
- **Comentários só para o *porquê*** — o código deve ser auto-explicativo
- **Conventional Commits** — `feat:`, `fix:`, `refactor:`, etc.

---

## O Que Vem Por Aí

O roadmap inclui:

- **i18n** — suporte a múltiplos idiomas com dicionário customizado
- **Testes** — Vitest + Testing Library para testes unitários e de componente
- **Páginas de projetos** — página de listagem com card grid e filtros
- **Performance** — Lighthouse 100, Open Graph, sitemap, RSS

---

O código-fonte completo está disponível em [github.com/anomalyco/alexmrtr](https://github.com/anomalyco/alexmrtr). Sinta-se à vontade para explorar, abrir issues ou sugerir melhorias.
