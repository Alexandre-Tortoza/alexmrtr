import { buildSections }   from '../sections/section.factory.js';
import { avatarRenderer }  from '../renderers/avatar.renderer.js';
import { headerRenderer }  from '../renderers/header.renderer.js';
import { infoRenderer }    from '../renderers/info.renderer.js';
import { qrRenderer }      from '../renderers/qr.renderer.js';
import { stacksRenderer }  from '../renderers/stacks.renderer.js';
import { boxRenderer }     from '../renderers/box.renderer.js';

/**
 * Registry maps pipeline keys to their renderer and a data extractor.
 *
 * sideEffect: true  → renderer writes directly to stdout (e.g. QR code).
 *                     It is deferred and called ONCE after the box is printed.
 * sideEffect: false → renderer returns a string that is collected into the box.
 *
 * To add a new section:
 *   1. Create src/renderers/<name>.renderer.js
 *   2. Import and register it below
 *   3. Add the key to `pipeline` in card.config.js
 */
const rendererRegistry = {
  avatar: { renderer: avatarRenderer, getData: (c) => c.avatar,              sideEffect: false },
  header: { renderer: headerRenderer, getData: (c) => c,                     sideEffect: false },
  info:   { renderer: infoRenderer,   getData: (c) => buildSections(c.info), sideEffect: false },
  qr:     { renderer: qrRenderer,     getData: (c) => c.qr,                  sideEffect: true  },
  stacks: { renderer: stacksRenderer, getData: (c) => c.stacks,              sideEffect: true  },
};

export class CardComposer {
  constructor(config, theme) {
    this.config = config;
    this.theme  = theme;
  }

  render() {
    const boxParts    = [];
    const sideEffects = [];

    for (const key of this.config.pipeline) {
      const entry = rendererRegistry[key];
      if (!entry) continue;

      const data = entry.getData(this.config);

      if (entry.sideEffect) {
        // Defer side-effecting renderers until after the box is printed
        sideEffects.push(() => entry.renderer.render(data, this.theme));
      } else {
        const result = entry.renderer.render(data, this.theme);
        if (result !== null && result !== undefined) {
          boxParts.push(result);
        }
      }
    }

    console.log(boxRenderer.render(boxParts.join('\n\n'), this.theme));
    sideEffects.forEach((fn) => fn());
  }
}
