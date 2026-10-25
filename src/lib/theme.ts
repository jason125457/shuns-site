export type Theme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'theme';

export function parseTheme(value: unknown): Theme | null {
  return value === 'light' || value === 'dark' ? value : null;
}

/** The theme on screen: the visitor's saved choice wins, otherwise the system setting. */
export function resolveTheme(saved: unknown, systemPrefersDark: boolean): Theme {
  return parseTheme(saved) ?? (systemPrefersDark ? 'dark' : 'light');
}

export function toggleTheme(current: Theme): Theme {
  return current === 'dark' ? 'light' : 'dark';
}
