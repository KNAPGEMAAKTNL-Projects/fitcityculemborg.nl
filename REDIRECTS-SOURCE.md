# REDIRECTS-SOURCE.md
# FitCity Culemborg — Existing URL Audit
# Generated: 2026-04-04 | Used in Session 4 for 301 redirect mapping

## Crawl Method
- Attempted sitemap.xml: FAILED (SSL certificate invalid — ERR_CERT_COMMON_NAME_INVALID)
- Crawled via HTTP (non-HTTPS): SUCCESS
- Nav/footer link extraction: no sub-pages found (single-page site)

## SSL Status
⚠️ The current domain has an invalid SSL certificate (common name mismatch).
The new build on Cloudflare Pages will fix this automatically.

## Indexed Pages

| Current URL | Page Title | Notes | Importance |
|---|---|---|---|
| `http://fitcityculemborg.nl/` | Fitcity Culemborg – Gezondheidscentrum voor Sport, Bewegen & Zorg | Homepage — single-page site, all content on one URL | HIGH |

## Redirect Mapping Notes

- **No sub-pages exist** — there is nothing to 301-redirect beyond the homepage itself.
- The homepage URL path `/` should remain at `/` in the new build (already the default).
- The new build will introduce sub-pages (e.g., `/fitness/`, `/ladies-only/`, `/kickboxing/`, `/contact/`) — these are **new URLs with no existing equivalents**, so no redirects are needed for them.
- The domain switch from HTTP to HTTPS is handled by Cloudflare Pages automatically.

## Current URL Structure Assessment
**Rating: Very weak.** Single-page site with no logical URL hierarchy. No clean slugs to preserve. The new build starts fresh — no redirect constraints.

## Content Audit (What Exists on Current Site)

### What Works
- Page title includes location keyword "Culemborg" ✓
- USPs stated in headings: goedkoopste sportschool, professionele trainers, ladies only ruimte ✓
- Opening times displayed ✓
- Brand name in footer with year ✓

### Critical Issues Found
1. **Lorem Ipsum placeholder text** — WEIGHT LOSS and BUIK UP sections contain "Lorem ipsum dolor sit amet, consectetur adipiscing elit." — never replaced
2. **Indian gym competition content** — Headings include "2021 INDIA OLIMPIA — RISHAB — 2ND RUNNER-UP" and "2019 INDIA OLIMPIA — RAMAN — 1ST PLACE" — copy-pasted template content never removed
3. **No navigation menu** — zero nav links found, no internal linking
4. **No CTA buttons** — zero clickable calls to action detected
5. **No pricing** — despite "goedkoopste sportschool" positioning, no pricing visible
6. **No Google Reviews integration** — zero social proof
7. **SSL certificate invalid** — site serves HTTP only, HTTPS broken
8. **Zero SEO sub-pages** — no /fitness/, /kickboxen/, /contact/ etc.
9. **Title calls it "Gezondheidscentrum"** — dilutes gym/sportschool keyword focus
