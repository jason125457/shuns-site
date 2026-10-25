import { describe, expect, it } from 'vitest';
import { parseYouTubeId } from './youtube';

const ID = 'dQw4w9WgXcQ';

describe('parseYouTubeId', () => {
  it.each([
    `https://www.youtube.com/watch?v=${ID}`,
    `https://www.youtube.com/watch?v=${ID}&t=42s&list=PL123`,
    `https://m.youtube.com/watch?v=${ID}`,
    `https://music.youtube.com/watch?v=${ID}`,
    `https://youtu.be/${ID}`,
    `https://youtu.be/${ID}?si=tracking`,
    `https://www.youtube.com/shorts/${ID}`,
    `https://www.youtube.com/live/${ID}`,
    `https://www.youtube.com/embed/${ID}`,
    `  https://youtu.be/${ID}  `,
  ])('reads %s', (url) => {
    expect(parseYouTubeId(url)).toBe(ID);
  });

  it.each([
    'not a url',
    `https://vimeo.com/${ID}`,
    `https://youtube.com.evil.example/watch?v=${ID}`,
    'https://www.youtube.com/watch?v=short',
    'https://www.youtube.com/@channel',
    `javascript:alert('${ID}')`,
  ])('rejects %s', (url) => {
    expect(parseYouTubeId(url)).toBeNull();
  });
});
