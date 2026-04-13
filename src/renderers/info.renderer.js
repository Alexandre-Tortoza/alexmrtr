import terminalLink from 'terminal-link';

export const infoRenderer = {
  render(sections, theme) {
    return sections
      .map((s) => {
        const icon  = s.icon ? `${s.icon}  ` : '    ';
        const label = theme.colors.label(`${icon}${s.label}:`);
        const val   = s.url
          ? theme.colors.link(terminalLink(s.value, s.url, { fallback: () => s.value }))
          : theme.colors.value(s.value);
        return `  ${label} ${val}`;
      })
      .join('\n');
  },
};
