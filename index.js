#!/usr/bin/env node

import { cardConfig }   from './config/card.config.js';
import { defaultTheme } from './themes/default.theme.js';
import { CardComposer } from './composer/card.composer.js';
import { playIntro }    from './animation/intro.animation.js';

async function main() {
  if (cardConfig.animation.enabled) {
    await playIntro();
  }

  new CardComposer(cardConfig, defaultTheme).render();
}

main();
