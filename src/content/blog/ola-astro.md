---
title: "Introdução ao Desenvolvimento Web com Astro"
description: "Conheça o Astro, um framework moderno para construir sites rápidos com menos JavaScript e mais HTML estático."
pubDate: 2026-05-15
tags: ["Astro", "Web", "Tutorial"]
draft: false
---

Astro é um framework web que entrega sites com zero JavaScript por padrão, carregando apenas o que é necessário. Diferente de frameworks como Next.js ou Nuxt, o Astro renderiza HTML no servidor e envia o mínimo de JS para o navegador.

## Por que Astro?

A principal vantagem do Astro é sua abordagem de **ilhas** — componentes interativos que existem em uma página predominantemente estática. Isso significa que você pode usar React, Vue, Svelte ou SolidJS em componentes específicos sem pagar o custo de carregar todo o runtime do framework.

## Content Collections

Uma das funcionalidades mais poderosas do Astro são as **Content Collections**, que permitem gerenciar conteúdo com validação de schema via Zod:

```typescript
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    tags: z.array(z.string()).default([]),
  }),
});
```

Isso garante que todo post tenha os campos necessários com os tipos corretos.

## Performance nativa

O Astro é construído para performance desde o início:
- HTML estático sem JavaScript
- Code splitting automático
- Lazy loading de componentes
- Otimização de imagens embutida

Para um portfólio pessoal ou blog, Astro oferece a combinação ideal de flexibilidade e velocidade.
