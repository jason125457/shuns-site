const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;
const YOUTUBE_HOSTS = new Set([
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'music.youtube.com',
]);

/**
 * Extracts the 11-character video ID from the YouTube URL forms people paste:
 * watch?v=, youtu.be/, /shorts/, /live/, /embed/. Returns null for anything else.
 */
export function parseYouTubeId(input: string): string | null {
  let url: URL;
  try {
    url = new URL(input.trim());
  } catch {
    return null;
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;

  let candidate: string | null = null;
  if (url.hostname === 'youtu.be') {
    candidate = url.pathname.split('/')[1] ?? null;
  } else if (YOUTUBE_HOSTS.has(url.hostname)) {
    const [, first, second] = url.pathname.split('/');
    if (first === 'watch') candidate = url.searchParams.get('v');
    else if (first === 'shorts' || first === 'live' || first === 'embed')
      candidate = second ?? null;
  }

  return candidate && VIDEO_ID.test(candidate) ? candidate : null;
}
