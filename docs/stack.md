# Tech Stack

## Runtime dependencies

| Package | Version | Purpose | Docs | Commands |
|---|---|---|---|---|
| [astro](https://www.npmjs.com/package/astro) | ^6.4.2 | Static site generator, routing, island architecture | [docs.astro.build](https://docs.astro.build) | `pnpm astro dev`, `pnpm astro build`, `pnpm astro preview` |
| [@tailwindcss/vite](https://www.npmjs.com/package/@tailwindcss/vite) | ^4.3.0 | Tailwind CSS v4 Vite plugin | [tailwindcss.com/docs](https://tailwindcss.com/docs) | — |
| [tailwindcss](https://www.npmjs.com/package/tailwindcss) | ^4.3.0 | Utility-first CSS framework (v4 uses CSS-first config) | [tailwindcss.com/docs](https://tailwindcss.com/docs) | — |
| [three](https://www.npmjs.com/package/three) | ^0.184.0 | 3D WebGL rendering (mesh particle background) | [threejs.org/docs](https://threejs.org/docs) | — |
| [gsap](https://www.npmjs.com/package/gsap) | ^3.15.0 | Animation library (smooth mouse interpolation) | [gsap.com/docs](https://gsap.com/docs) | — |
| [asciify-engine](https://www.npmjs.com/package/asciify-engine) | latest | Image/video to ASCII art conversion (13 styles, zero deps) | [github.com/ayangabryl/asciify-engine](https://github.com/ayangabryl/asciify-engine) | — |

## Dev dependencies

| Package | Version | Purpose | Docs |
|---|---|---|---|
| [eslint](https://www.npmjs.com/package/eslint) | ^10.4.0 | Linter | [eslint.org/docs](https://eslint.org/docs) |
| [@eslint/js](https://www.npmjs.com/package/@eslint/js) | ^10.0.1 | ESLint core JS rules (flat config) | [eslint.org/docs](https://eslint.org/docs) |
| [eslint-plugin-astro](https://www.npmjs.com/package/eslint-plugin-astro) | ^1.7.0 | Astro-specific lint rules | [github.com/ota-meshi/eslint-plugin-astro](https://github.com/ota-meshi/eslint-plugin-astro) |
| [@stylistic/eslint-plugin](https://www.npmjs.com/package/@stylistic/eslint-plugin) | ^5.10.0 | Code style rules (formatting) | [eslint.style](https://eslint.style) |
| [@types/three](https://www.npmjs.com/package/@types/three) | ^0.184.1 | TypeScript types for Three.js | [npmjs.com/package/@types/three](https://www.npmjs.com/package/@types/three) |

## Planned

| Package | Purpose |
|---|---|
| [vitest](https://vitest.dev) | Test runner |
| [@testing-library/astro](https://testing-library.com) | Component testing |

## Key commands

```bash
pnpm dev          # start dev server on localhost:4321
pnpm build        # production build → dist/
pnpm preview      # preview production build
pnpm astro --help # list all Astro CLI commands
pnpm lint         # run ESLint (when configured)
pnpm test         # run Vitest (when installed)
```
