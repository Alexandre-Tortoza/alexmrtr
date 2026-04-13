import boxen from 'boxen';

export const boxRenderer = {
  render(content, theme) {
    return boxen(content, {
      padding:     theme.box.padding,
      margin:      theme.box.margin,
      borderStyle: theme.box.borderStyle,
      borderColor: theme.box.borderColor,
      width:       theme.box.width,
    });
  },
};
