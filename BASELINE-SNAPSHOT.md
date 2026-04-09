# Baseline Snapshot — Fitcity Culemborg

Captured: 9 april 2025 (pre-SEO schema/OG/sitemap deployment)

## Lighthouse Scores — Homepage

| Metric | Mobile | Desktop |
|--------|--------|---------|
| Performance | 88 | 98 |
| Accessibility | 100 | 100 |
| Best Practices | 96 | 96 |
| SEO | 100 | 100 |

## Core Web Vitals — Homepage

| CWV | Mobile | Desktop | Target |
|-----|--------|---------|--------|
| LCP | 2.9s | 0.9s | < 1.5s |
| CLS | 0 | 0.009 | < 0.1 |
| TBT | 0ms | 0ms | < 200ms |
| Speed Index | 4.8s | — | — |

## Notes

- Mobile Performance at 88 (target: 90+) — LCP of 2.9s is the primary bottleneck (hero video)
- Desktop at 98 — excellent
- Accessibility 100 on both — perfect
- SEO 100 on both — meta titles/descriptions already in place before this session
- CLS near-zero — no layout shift issues
- TBT 0ms — no blocking JavaScript (static site)

## What was missing at snapshot time

- No sitemap-index.xml (robots.txt referenced it, but it 404'd)
- No schema markup (LocalBusiness, FAQ, Service, Breadcrumb)
- No Open Graph / Twitter Card meta tags
- No canonical URLs
- No _redirects file (www → non-www)

## Google Search Console

- Property: fitcityculemborg.nl (already verified by site owner)
- Sitemap: not yet submitted (sitemap didn't exist)
- Status at snapshot: pending manual review after SEO deployment

## Comparison Plan

- Week 1: re-run Lighthouse, check GSC indexing status, compare against this baseline
- Month 1: full GSC report (clicks, impressions, queries), compare Lighthouse
