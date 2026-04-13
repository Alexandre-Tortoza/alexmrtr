// Strips ANSI escape codes to measure the true visual width of a string
const stripAnsi = (str) => str.replace(/\x1B\[[0-9;]*m/g, '');

function padLine(line, width) {
  const visual = stripAnsi(line).length;
  return line + ' '.repeat(Math.max(0, width - visual));
}

function centerLine(line, frameInnerWidth) {
  const visual = stripAnsi(line).length;
  const total = Math.max(0, frameInnerWidth - visual);
  const left = Math.floor(total / 2);
  const right = total - left;
  return ' '.repeat(left) + line + ' '.repeat(right);
}

export const avatarRenderer = {
  render(avatarConfig, theme) {
    // inner width of the art frame (excluding border chars ╔╗).
    // box content area = box.width - 2(border) - 2(padding LR) = 60
    // frame uses: 2(indent "  ") + 1(╔) + N + 1(╗) ≤ 60 → N ≤ 56
    const FRAME_INNER_W = 50;

    const topBorder = theme.colors.name('  ╔' + '═'.repeat(FRAME_INNER_W) + '╗');
    const bottomBorder = theme.colors.name('  ╚' + '═'.repeat(FRAME_INNER_W) + '╝');
    const side = (content) =>
      theme.colors.name('  ║') + content + theme.colors.name('║');

    const emptyLine = side(' '.repeat(FRAME_INNER_W));

    let artLines;

    if (avatarConfig.art) {
      const rawLines = avatarConfig.art.split('\n');
      const paintArt = theme.colors.art ?? theme.colors.name;

      // Block centering: fixed left offset derived from the widest line,
      // so the art moves as a single unit instead of each line independently.
      const maxWidth = Math.max(...rawLines.map((l) => stripAnsi(l).length));
      const leftPad  = Math.max(0, Math.floor((FRAME_INNER_W - maxWidth) / 2));

      artLines = rawLines.map((line) => {
        const visual  = stripAnsi(line).length;
        const content = ' '.repeat(leftPad) + line + ' '.repeat(Math.max(0, FRAME_INNER_W - leftPad - visual));
        return side(paintArt(content));
      });
    } else {
      // Placeholder slot
      const label = '[ ASCII art slot ]';
      const hint = 'set avatar.art in card.config.js';
      const labelLine = side(centerLine(theme.colors.dim(label), FRAME_INNER_W));
      const hintLine = side(centerLine(theme.colors.dim(hint), FRAME_INNER_W));
      artLines = [
        emptyLine,
        emptyLine,
        labelLine,
        emptyLine,
        hintLine,
        emptyLine,
        emptyLine,
      ];
    }

    const rows = [topBorder, emptyLine, ...artLines, emptyLine, bottomBorder];
    return rows.join('\n');
  },
};
