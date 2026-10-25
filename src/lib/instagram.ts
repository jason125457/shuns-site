export interface InstagramPost {
  kind: 'p' | 'reel';
  code: string;
  /** Canonical post URL without tracking parameters, as the official embed expects. */
  permalink: string;
}

const SHORTCODE = /^[A-Za-z0-9_-]{5,}$/;

/** Accepts instagram.com/p/CODE, /reel/CODE, and /username/p/CODE links. */
export function parseInstagramPost(input: string): InstagramPost | null {
  let url: URL;
  try {
    url = new URL(input.trim());
  } catch {
    return null;
  }
  if (url.protocol !== 'https:' || !['instagram.com', 'www.instagram.com'].includes(url.hostname)) {
    return null;
  }

  const parts = url.pathname.split('/').filter(Boolean);
  const index = parts.findIndex((part) => part === 'p' || part === 'reel' || part === 'reels');
  if (index === -1 || index > 1) return null;

  const code = parts[index + 1];
  if (!code || !SHORTCODE.test(code)) return null;

  const kind = parts[index] === 'p' ? 'p' : 'reel';
  return { kind, code, permalink: `https://www.instagram.com/${kind}/${code}/` };
}
