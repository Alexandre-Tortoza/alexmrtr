# Terminal Profile Card

Projeto em Node.js para renderizar um card de perfil no terminal, com:
- cabeçalho em ASCII art (`figlet`)
- caixa estilizada (`boxen`)
- links clicáveis no terminal (`terminal-link`)
- QR code opcional (`qrcode-terminal`)
- pipeline configurável de seções

## Requisitos

- Node.js 18+ (recomendado)
- npm

## Instalação

```bash
npm install chalk figlet terminal-link qrcode-terminal boxen
```

## Execução

```bash
node index.js
```

ou, se o arquivo estiver executável:

```bash
./index.js
```

## Configuração

As personalizações principais ficam em `config/card.config.js`:

- `name` e `tagline`
- `avatar.art` (ASCII art do avatar)
- `info` (itens de informação com `label`, `value`, `icon`, `url`)
- `qr` (`enabled`, `url`, `label`)
- `animation.enabled`
- `stacks` (categorias e itens)
- `pipeline` (ordem de renderização das seções)

Tema visual em `themes/default.theme.js`:

- fonte do figlet (`figletFont`)
- cores (`colors`)
- aparência do box (`box`)

## Estrutura

```text
src/
├── index.js                   # ponto de entrada
├── config/card.config.js      # dados e ordem do pipeline
├── composer/card.composer.js  # composição e execução dos renderers
├── renderers/                 # renderers por seção
├── sections/                  # fábrica de seções
├── domain/section.js          # modelo de seção
├── themes/default.theme.js    # tema
└── animation/intro.animation.js
```

## Como adicionar uma nova seção

1. Crie um renderer em `renderers/<nome>.renderer.js`.
2. Registre no `rendererRegistry` em `composer/card.composer.js`.
3. Inclua a chave no array `pipeline` em `config/card.config.js`.

## Licença

Defina a licença desejada para o projeto (ex.: MIT).
