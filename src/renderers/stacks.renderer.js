import boxen from 'boxen';

// Strip ANSI codes to measure true visual width
const stripAnsi = (s) => s.replace(/\x1B\[[0-9;]*m/g, '');

function wrapItems(items, colorFn, dimFn, availableWidth) {
  const SEP     = ' · ';
  const sepStr  = dimFn(SEP);
  const lines   = [];
  let current   = '';
  let currentW  = 0;

  for (let i = 0; i < items.length; i++) {
    const item  = colorFn(items[i]);
    const itemW = stripAnsi(items[i]).length;
    const sep   = i < items.length - 1 ? sepStr : '';
    const sepW  = i < items.length - 1 ? SEP.length : 0;
    const chunk = item + sep;
    const chunkW = itemW + sepW;

    if (currentW + chunkW > availableWidth && currentW > 0) {
      lines.push(current);
      current  = chunk;
      currentW = chunkW;
    } else {
      current  += chunk;
      currentW += chunkW;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export const stacksRenderer = {
  render(stacks, theme) {
    if (!stacks?.length) return null;

    // box content width = box.width - 2 (borders) - 2 (padding L) - 2 (padding R)
    const contentWidth = theme.box.width - 6;
    const labelWidth   = Math.max(...stacks.map((s) => s.category.length));

    // "  " (2) + label (labelWidth) + " ▸ " (3) = prefix width
    const prefixWidth  = 2 + labelWidth + 3;
    const itemsWidth   = contentWidth - prefixWidth;

    const rows = stacks.flatMap((stack) => {
      const label         = theme.colors.label(stack.category.padEnd(labelWidth));
      const prefix        = `  ${label} ▸ `;
      const continuation  = `  ${' '.repeat(labelWidth)}   `;

      const wrappedLines = wrapItems(stack.items, theme.colors.value, theme.colors.dim, itemsWidth);

      return wrappedLines.map((line, idx) =>
        idx === 0 ? prefix + line : continuation + line,
      );
    });

    const content = rows.join('\n');

    process.stdout.write(
      boxen(content, {
        padding:        theme.box.padding,
        margin:         theme.box.margin,
        borderStyle:    theme.box.borderStyle,
        borderColor:    theme.box.borderColor,
        width:          theme.box.width,
        title:          ' Stack ',
        titleAlignment: 'left',
      }),
    );
    process.stdout.write('\n');

    return null;
  },
};
