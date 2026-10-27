import { canonicalRedirect } from './redirect';

// Runs in front of the static assets only to move shuns.site visitors to www.shuns.site.
// Everything else is served straight from dist/ through the ASSETS binding.

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const target = canonicalRedirect(new URL(request.url));
    if (target) return Response.redirect(target, 301);
    return env.ASSETS.fetch(request);
  },
};
