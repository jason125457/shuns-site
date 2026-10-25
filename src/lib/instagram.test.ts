import { describe, expect, it } from 'vitest';
import { parseInstagramPost } from './instagram';

describe('parseInstagramPost', () => {
  it('normalises a post link and drops tracking parameters', () => {
    expect(parseInstagramPost('https://www.instagram.com/p/C1a2B3c4D5e/?igsh=abc')).toEqual({
      kind: 'p',
      code: 'C1a2B3c4D5e',
      permalink: 'https://www.instagram.com/p/C1a2B3c4D5e/',
    });
  });

  it('reads reels and username-prefixed links', () => {
    expect(parseInstagramPost('https://instagram.com/reel/Cxyz12345')?.permalink).toBe(
      'https://www.instagram.com/reel/Cxyz12345/',
    );
    expect(parseInstagramPost('https://www.instagram.com/reels/Cxyz12345/')?.kind).toBe('reel');
    expect(parseInstagramPost('https://www.instagram.com/someone/p/C1a2B3c4D5e/')?.code).toBe(
      'C1a2B3c4D5e',
    );
  });

  it.each([
    'https://www.instagram.com/someone/',
    'http://www.instagram.com/p/C1a2B3c4D5e/',
    'https://instagram.com.evil.example/p/C1a2B3c4D5e/',
    'https://www.instagram.com/p/',
    'nope',
  ])('rejects %s', (url) => {
    expect(parseInstagramPost(url)).toBeNull();
  });
});
