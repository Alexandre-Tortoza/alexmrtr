import qrcode from 'qrcode-terminal';
import boxen  from 'boxen';

// Center each line of a multi-line string within a given width
function centerBlock(text, width) {
  return text
    .split('\n')
    .map((line) => {
      const pad = Math.max(0, Math.floor((width - line.length) / 2));
      return ' '.repeat(pad) + line;
    })
    .join('\n');
}

export const qrRenderer = {
  render(qrConfig, theme) {
    if (!qrConfig.enabled) return null;

    // qrcode-terminal's callback is called synchronously
    let qrString = '';
    qrcode.generate(qrConfig.url, { small: true }, (str) => {
      qrString = str;
    });

    // Content area width = box.width - 2 (borders) - 2 (padding L+R)
    const contentWidth = theme.box.width - 6;
    const centeredQr   = centerBlock(qrString.trimEnd(), contentWidth);
    const label        = theme.colors.dim(qrConfig.label);

    const content = centeredQr + '\n\n  ' + label;

    process.stdout.write(
      boxen(content, {
        padding:        theme.box.padding,
        margin:         theme.box.margin,
        borderStyle:    theme.box.borderStyle,
        borderColor:    theme.box.borderColor,
        width:          theme.box.width,
        title:          ' QR Code ',
        titleAlignment: 'left',
      }),
    );
    process.stdout.write('\n');

    return null;
  },
};
