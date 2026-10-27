import { describe, expect, it } from 'vitest';
import { formatFilmDate } from './date';

describe('formatFilmDate', () => {
  it('pads month and day and ignores the local time zone', () => {
    expect(formatFilmDate(new Date('2024-01-05'))).toBe('2024.01.05');
    expect(formatFilmDate(new Date('2026-10-25'))).toBe('2026.10.25');
  });
});
