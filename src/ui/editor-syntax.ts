// Token colors for the light and dark editor backgrounds. Keep this data
// separate from the React component so readability tests use the same palette.
export const EDITOR_SYNTAX_COLORS = {
  light: {
    comment: '#52665a', keyword: '#6f3a88', number: '#205d99',
    string: '#236740', function: '#80500f', operator: '#384b45',
  },
  dark: {
    comment: '#a8bdb0', keyword: '#dbc3f0', number: '#a8caef',
    string: '#a8d6ae', function: '#e6c792', operator: '#d4e3d8',
  },
} as const;
