import { describe, expect, it } from 'vitest';
import { parseTheme, resolveTheme, toggleTheme } from './theme';

describe('parseTheme', () => {
  it('accepts only light and dark', () => {
    expect(parseTheme('light')).toBe('light');
    expect(parseTheme('dark')).toBe('dark');
    expect(parseTheme('sepia')).toBeNull();
    expect(parseTheme(null)).toBeNull();
  });
});

describe('resolveTheme', () => {
  it('prefers the saved choice over the system setting', () => {
    expect(resolveTheme('light', true)).toBe('light');
    expect(resolveTheme('dark', false)).toBe('dark');
  });

  it('falls back to the system setting when nothing valid is saved', () => {
    expect(resolveTheme(null, true)).toBe('dark');
    expect(resolveTheme('garbage', false)).toBe('light');
  });
});

describe('toggleTheme', () => {
  it('flips between light and dark', () => {
    expect(toggleTheme('light')).toBe('dark');
    expect(toggleTheme('dark')).toBe('light');
  });
});
