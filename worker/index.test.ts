import { describe, expect, it, vi } from 'vitest';
import worker from './index';
import { canonicalRedirect } from './redirect';

describe('canonicalRedirect', () => {
  it('sends the apex to www and keeps the path, query, and hash', () => {
    expect(canonicalRedirect(new URL('https://shuns.site/'))).toBe('https://www.shuns.site/');
    expect(canonicalRedirect(new URL('http://shuns.site/a/b?x=1#projects'))).toBe(
      'https://www.shuns.site/a/b?x=1#projects',
    );
  });

  it('leaves the canonical host and unrelated hosts alone', () => {
    expect(canonicalRedirect(new URL('https://www.shuns.site/'))).toBeNull();
    expect(canonicalRedirect(new URL('https://feed.shuns.site/'))).toBeNull();
    expect(canonicalRedirect(new URL('http://localhost:8787/'))).toBeNull();
  });
});

describe('worker fetch', () => {
  it('answers apex requests with a permanent redirect without touching assets', async () => {
    const assets = { fetch: vi.fn() };
    const response = await worker.fetch(new Request('https://shuns.site/x'), { ASSETS: assets });
    expect(response.status).toBe(301);
    expect(response.headers.get('location')).toBe('https://www.shuns.site/x');
    expect(assets.fetch).not.toHaveBeenCalled();
  });

  it('serves www requests from the static assets', async () => {
    const page = new Response('ok');
    const assets = { fetch: vi.fn().mockResolvedValue(page) };
    const request = new Request('https://www.shuns.site/');
    expect(await worker.fetch(request, { ASSETS: assets })).toBe(page);
    expect(assets.fetch).toHaveBeenCalledWith(request);
  });
});
