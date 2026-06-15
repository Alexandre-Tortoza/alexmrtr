---
title: "Deep Dive: A Engenharia por trás deste Portfolio"
description: "Uma explicação técnica detalhada sobre sistemas de partículas, projeção 3D em Canvas e interatividade avançada com GSAP."
pubDate: 2026-05-30
tags: ["Astro", "Canvas", "GSAP", "Arquitetura", "FSD", "TypeScript"]
draft: false
---

Este post é uma análise técnica profunda sobre como este site foi construído. Vamos explorar o motor de renderização visual, a lógica de navegação e as decisões arquiteturais que garantem performance e escalabilidade.

---

## Motor Visual: Sistemas de Partículas em Canvas

O site utiliza múltiplos sistemas de partículas baseados em HTML5 Canvas, todos orquestrados pelo `gsap.ticker` para garantir sincronia com a taxa de atualização do monitor (60Hz/120Hz).

### 1. Stardust: Projeção 3D de Túnel (Warp Speed)

A feature `Stardust` simula uma viagem espacial. Diferente de um sistema 2D simples, ela utiliza **projeção perspectiva**:

```typescript
// stardust.ts - Projeção de 3D para 2D
const scale = fov / p.z;
const x2d = centerX + p.x * scale;
const y2d = centerY + p.y * scale;
```

- **Coordenadas Z**: As partículas nascem no fundo (`z = 2000`) e avançam em direção à câmera (`z -= speed`).
- **Rastros Dinâmicos**: Calculamos a posição anterior (`prevZ`) para desenhar linhas que representam o rastro de movimento, criando o efeito "warp".
- **Otimização**: Utilizamos um pool de partículas fixo (`numParticles = 600`) para evitar o overhead de criação/destruição de objetos, apenas "resetando" as coordenadas quando a partícula ultrapassa a câmera.

### 2. BinaryStars: Background com Vignette e Escala

Na seção "Sobre", implementamos um sistema de bits (`0` e `1`) com refinamentos visuais avançados:

- **Radial Gradient Mask**: Utilizamos a propriedade CSS `mask-image: radial-gradient(...)` para criar um efeito de vinheta, fazendo com que o código desapareça suavemente nas bordas.
- **Extrapolação de Container**: O Canvas é renderizado em `scale-110`, garantindo que o efeito de fundo transborde os limites visuais da seção, criando uma sensação de continuidade.
- **Twinkle Logic**: Cada bit possui uma `targetOpacity` e `twinkleSpeed` individuais, resultando em uma animação orgânica e não-linear.

---

## Navegação Inteligente e Glassmorphism

A `Navbar` foi projetada para ser contextual e altamente interativa.

### Condicional de Visibilidade

```typescript
// navbar.ts
const isIndex = window.location.pathname === "/";
if (!isIndex) {
  gsap.set(navbar, { y: 0, opacity: 1 });
} else {
  // Lógica de ScrollTrigger para esconder no Hero da Index
}
```

### O Efeito "Swap" de Blur

Implementamos um sistema de troca dinâmica de estilos de vidro:

1. **Estado Ativo**: Por padrão, apenas o link da página atual possui um fundo pílula com `backdrop-blur`.
2. **Hover Interaction**: Ao entrar na área da Navbar, usamos GSAP para:
    - Remover o fundo do item ativo.
    - Ativar o blur e fundo translúcido em todo o container da Navbar.
    - Isso cria uma experiência de "foco" quando o usuário interage com o menu.

---

## Arquitetura: Feature-Sliced Design (FSD)

O projeto segue a metodologia FSD para manter o código modular e fácil de manter.

```
src/
├── app/          → Layouts base e estilos globais (@tailwindcss/vite)
├── pages/        → Sistema de roteamento do Astro
├── features/     → Unidades funcionais independentes (Stardust, Navbar, About)
├── entities/     → Modelos de dados e tipos de domínio
└── content/      → Fonte de dados via Markdown
```

### Por que FSD?

- **Isolamento**: Se eu quiser trocar o efeito `Stardust` por outro, eu apenas mexo em uma pasta.
- **Acoplamento Baixo**: As features não dependem umas das outras. A `Navbar` não sabe que o `Stardust` existe.
- **Escalabilidade**: Adicionar uma nova seção (ex: Galeria) é apenas criar um novo slice na camada de `features`.

---

## Design System com Tailwind CSS v4

Utilizamos a nova engine do Tailwind que permite uma configuração muito mais limpa via CSS:

```css
@theme {
  --color-mesh-1: #1ea7b6;  /* Ciano Principal */
  --color-stardust-lilac: #B489D1; /* Tom de Contraste */
  --breakpoint-4xl: 2440px; /* Suporte a telas ultra-wide */
}
```

Essa abordagem nos permitiu ajustar o layout do **Hero** especificamente para monitores de 2440px, garantindo que o título "Programador" nunca sobreponha os elementos visuais, mantendo o balanço composicional através de grids responsivos.

---

## Conclusão

Este portfolio não é apenas uma vitrine, mas um laboratório de experimentos em **Motion Design** e **Frontend Engineering**. O uso de ferramentas como Astro e GSAP nos permite entregar uma experiência visual rica sem sacrificar a performance (Lighthouse scores próximos de 100).

O código-fonte completo está disponível em [github.com/alexandre-tortoza/alexmrtr](https://github.com/Alexandre-Tortoza/alexmrtr).
