import figlet from 'figlet';

export const headerRenderer = {
  render(config, theme) {
    const ascii = figlet.textSync(config.name, { font: theme.figletFont });
    return theme.colors.name(ascii) + '\n' + theme.colors.dim('  ' + config.tagline);
  },
};
