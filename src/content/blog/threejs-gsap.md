---
title: "Explorando Efeitos Visuais com Three.js e GSAP"
description: "Como combinando WebGL e animações de alta performance criei backgrounds interativos para este site."
pubDate: 2026-05-25
tags: ["Three.js", "GSAP", "Animação", "WebGL"]
draft: false
---

Efeitos visuais podem transformar completamente a experiência de um site. Neste post, mostro como usei **Three.js** e **GSAP** para criar o background de partículas deste portfólio.

## Three.js para WebGL

Three.js é uma biblioteca que abstrai a API WebGL, tornando acessível a criação de gráficos 3D no navegador.

O background de mesh usa um sistema de partículas:

```typescript
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(totalPoints * 3);
// Grid de pontos com cores aleatórias da paleta
```

Cada partícula é um ponto no espaço com posição, cor e tamanho definidos via `BufferGeometry`.

## GSAP para suavização

O **GSAP** entra para suavizar o movimento do mouse:

```typescript
const smoothMouse = () => {
  mouseCurrent.x += (mouseTarget.x - mouseCurrent.x) * 0.04;
  mouseCurrent.y += (mouseTarget.y - mouseCurrent.y) * 0.04;
};
gsap.ticker.add(smoothMouse);
```

Isso cria uma interpolação suave entre a posição atual do mouse e a posição alvo, resultando em um movimento fluido.

## Interação com o usuário

As partículas reagem à posição do mouse:

- Partículas próximas ao cursor aumentam de brilho e tamanho
- A câmera segue sutilmente o movimento do mouse
- Ondas senoidais percorrem o grid continuamente

O resultado é um fundo vivo que responde à interação sem ser intrusivo — exatamente o que um bom background deve fazer.
