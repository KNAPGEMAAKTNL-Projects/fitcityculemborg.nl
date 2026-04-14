/**
 * Global middleware: redirects /admin/ requests on non-canonical domains
 * to fitcityculemborg.nl where Cloudflare Access enforces login.
 *
 * This runs BEFORE the static page is served, so the admin HTML
 * is never visible on www, pages.dev, or preview deployments.
 */

const CANONICAL_HOST = 'fitcityculemborg.nl';

export const onRequest: PagesFunction = async (context) => {
  const url = new URL(context.request.url);

  // Only intercept /admin paths
  if (!url.pathname.startsWith('/admin')) {
    return context.next();
  }

  // If already on the canonical domain, let it through
  // (Cloudflare Access will handle auth)
  if (url.hostname === CANONICAL_HOST) {
    return context.next();
  }

  // Redirect to canonical domain
  return Response.redirect(`https://${CANONICAL_HOST}${url.pathname}${url.search}`, 302);
};
