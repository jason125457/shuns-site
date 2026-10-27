export const CANONICAL_HOST = 'www.shuns.site';

/** Hosts that serve the same site but should send visitors to the canonical one. */
const ALIAS_HOSTS = new Set(['shuns.site']);

/** The canonical URL for a request on an alias host, keeping path and query; null otherwise. */
export function canonicalRedirect(url: URL): string | null {
  if (!ALIAS_HOSTS.has(url.hostname)) return null;
  const target = new URL(url);
  target.protocol = 'https:';
  target.hostname = CANONICAL_HOST;
  target.port = '';
  return target.toString();
}
