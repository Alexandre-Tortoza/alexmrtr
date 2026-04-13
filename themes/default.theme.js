import chalk from 'chalk';

export const defaultTheme = {
  figletFont: 'Big',

  colors: {
    name: chalk.bold.magentaBright,
    art: chalk.magenta,
    label: chalk.white.bold,
    value: chalk.green,
    link: chalk.cyan.underline,
    dim: chalk.gray,
  },

  box: {
    padding:     1,
    margin:      1,
    borderStyle: 'round',
    borderColor: 'gray',
    width:       66, // outer box width (excl. margin); syncs with stacks block
  },
};
