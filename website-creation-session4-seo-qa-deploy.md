# Session 4 --- SEO, QA & Deployment

> Can be 1--3 sessions depending on complexity.
> **Sub-session A: SEO** (~60 min) --- can follow Session 3 if context allows
> **Sub-session B: QA** (~45 min) --- separate session recommended
> **Sub-session C: Deploy + Handoff** (~60 min) --- separate session
> **Sub-session D: Post-Launch** (~30 min per check) --- weeks 1, 2, 4

---

## Sub-session A: SEO

### Prerequisites

- Session 3 complete: working Astro site that builds and runs on dev server
- Client data on hand: KvK, BTW, opening hours, service area cities, certifications, GBP URL
- `CONTENT/meta-tags.md`, `CONTENT/faq.md`, `CONTENT/sitemap.md` from Session 2
- Reference SOPs available: `Hub/inbox/sop-technical-seo.md`, `Hub/inbox/sop-local-seo.md`

### Prompt A1 --- Context Load & SEO Audit

```
Read the following files in this project:
- CLAUDE.md
- DESIGN.md
- CONTENT/sitemap.md (sitemap with keyword targets)
- CONTENT/meta-tags.md (draft meta tags from Session 2)
- CONTENT/faq.md (FAQ content)
- src/layouts/ (base layout, head component)
- astro.config.mjs

Also read the reference SOPs:
- C:\Users\yanni\Hub\inbox\sop-technical-seo.md
- C:\Users\yanni\Hub\inbox\sop-local-seo.md

We are in Session 4 Sub-session A: SEO. This is Prompt A1: CONTEXT LOAD & AUDIT ONLY.

DO NOT make any changes yet. Run a quick audit:

1. ASTRO CONFIG:
   - site set to production URL?
   - trailingSlash: 'always'?
   - @astrojs/sitemap in integrations?
   - build.inlineStylesheets: 'auto'?
   - output: 'static'?

2. HEAD/LAYOUT:
   - Dynamic <title> and <meta name="description">?
   - Self-referencing <link rel="canonical">?
   - Open Graph tags (og:title, og:description, og:image, og:url, og:type, og:locale)?
   - <html lang="nl">?
   - <meta charset="UTF-8"> and <meta name="viewport">?

3. EXISTING SCHEMA: any JSON-LD already implemented?

4. PERFORMANCE BASICS:
   - Hero images: loading="eager" + fetchpriority="high"?
   - Below-fold images: loading="lazy"?
   - Fonts preloaded?
   - public/_headers file exists?

5. MISSING FILES:
   - public/robots.txt?
   - public/llms.txt?
   - Location pages (werkgebied/[stad].astro)?

Report [OK] or [MISSING] for each item. Do not fix anything yet.
```

---

### Prompt A2 --- Meta Tags & OG Implementation

```
Read CONTENT/meta-tags.md and CONTENT/sitemap.md.

Prompt A2: META TAGS FINALIZATION.

For every page in the sitemap:

TITLE TAG: 50-60 chars, primary keyword front-loaded, brand after pipe, include location for service/home pages, unique per page.

DESCRIPTION: 140-155 chars, primary keyword included, lead with strongest benefit, include CTA verb (Vraag aan, Bel, Bekijk, Ontdek), unique per page.

OPEN GRAPH: og:title = title (up to 70 chars), og:description = description (up to 200 chars), og:image = site-wide 1200x630px default or page hero, og:url = canonical with trailing slash, og:type = "website" (or "article" for blog), og:locale = "nl_NL".

Implementation:

1. Create/update SEO head component accepting props:
   title: string, description: string, ogImage?: string, canonical?: string, noindex?: boolean

2. Update every page file to pass correct meta values.

3. Update CONTENT/meta-tags.md with finalized versions.

4. Legal pages (privacy, algemene voorwaarden): add noindex: true.

All canonical URLs must include trailing slash and full production domain.
```

---

### Prompt A3 --- Schema: LocalBusiness + Organization

```
Prompt A3: SCHEMA --- LocalBusiness.

Here is the client business data (fill in before running):

BUSINESS DATA:
- Legal name: [exact name from KvK]
- Schema @type: [specific type: Plumber, Electrician, Dentist, HousePainter, LandscapeArchitect, CleaningService, etc.]
- Street address: [straat + huisnummer]
- Postal code: [1234 AB format]
- City: [stad]
- Phone: [+31 format]
- Email: [info@domain.nl]
- KvK-nummer: [8-digit number]
- BTW-nummer: [NL + 9 digits + B + 2 digits]
- Latitude: [decimal]
- Longitude: [decimal]
- Price range: [e.g., "$$" or "EUR 35-75"]
- Opening hours: [e.g., Ma-Vr 08:00-18:00, Za 09:00-14:00]
- Service area cities: [comma-separated list]
- GBP profile URL: [full Google Maps URL]
- Website URL: [https://www.domain.nl]
- Logo URL: [/images/logo.png]
- Review count: [number]
- Average rating: [e.g., 4.8]
- sameAs URLs: [GBP, Facebook, LinkedIn, Werkspot, Instagram, etc.]
- Certifications: [VCA, KIWA, STEK, Bouwgarant, etc.]

Create src/components/seo/SchemaLocalBusiness.astro:
- JSON-LD @graph combining LocalBusiness + WebSite
- Use specific @type (not generic LocalBusiness)
- Include identifier array with KvK + BTW as PropertyValue
- Include aggregateRating, areaServed (city array), sameAs, openingHoursSpecification
- Include knowsAbout (core services) and hasOfferCatalog (service page links)
- Cross-reference with @id for other schema types
- CRITICAL: All data must exactly match GBP profile data

Add to base layout so it appears on every page. Validate the output against Google Rich Results Test format.
```

---

### Prompt A4 --- Schema: FAQ, Service, Breadcrumb

```
Read CONTENT/faq.md and all service page files in src/pages/diensten/.

Prompt A4: SCHEMA --- FAQPage, Service, BreadcrumbList.

1. Create src/components/seo/SchemaFAQ.astro:
   - Props: faqs: Array<{ question: string; answer: string }>
   - Generates FAQPage JSON-LD
   - Reusable: add to every page with visible FAQ content
   - CRITICAL: schema content must EXACTLY match visible FAQ text

2. Create src/components/seo/SchemaService.astro:
   - Props: service name, description, provider (@id ref to org), price range, area served
   - Include priceSpecification with priceCurrency: "EUR" and unitText
   - Add to each service page

3. Create src/components/seo/SchemaBreadcrumb.astro:
   - Auto-generates BreadcrumbList from Astro.url.pathname
   - Homepage > Section > Current Page
   - Add to base layout

4. Wire up: SchemaFAQ on all pages with visible FAQs, SchemaService on each diensten page, SchemaBreadcrumb in layout.

5. Verify a service page source has: LocalBusiness, BreadcrumbList, FAQPage, and Service schema as separate JSON-LD blocks or combined @graph.
```

---

### Prompt A5 --- Redirect Mapping (existing sites only)

```
Prompt A5: REDIRECT MAPPING.

Skip this prompt if the client has no existing website.

Read REDIRECTS-SOURCE.md (from Session 1 — contains the old site's URL structure).
Read CONTENT/sitemap.md (from Session 2 — contains the new URL structure).

Map old URLs to new URLs:

| Old URL | New URL | Type | Notes |
|---------|---------|------|-------|
| /diensten/tuinaanleg | /diensten/tuinaanleg/ | 301 | Direct match, add trailing slash |
| /over-ons.html | /over-ons/ | 301 | Clean URL |
| /old-page-removed | /diensten/ | 301 | Content merged into services overview |

RULES:
- Every old URL rated "high" importance in REDIRECTS-SOURCE.md MUST have a 301 redirect
- Medium importance: redirect if a natural match exists, otherwise redirect to closest parent
- Low importance: redirect to homepage if no match, or drop if the page had no content
- Never redirect to a 404
- Preserve query parameters where relevant (e.g., UTM tracking)

Create public/_redirects (Cloudflare Pages format):
/old-path /new-path/ 301
/old-path.html /new-path/ 301

For complex patterns, use splat rules:
/blog/:slug /blog/:slug/ 301

Save the mapping table to REDIRECTS.md for documentation.
Verify: no redirect loops, no chains longer than 2 hops.
```

---

### Prompt A6 --- Sitemap, robots.txt, llms.txt

```
Prompt A6 (was A5): SITEMAP, ROBOTS.TXT, LLMS.TXT.

SITEMAP:
1. Verify @astrojs/sitemap in integrations, configured to exclude /privacy/ and /algemene-voorwaarden/.
2. Run npm run build and verify dist/sitemap-index.xml: all public pages listed with trailing slashes, legal pages excluded.

ROBOTS.TXT --- create public/robots.txt:

# Allow standard and AI SEARCH crawlers
User-agent: *
Allow: /

User-agent: Googlebot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: ClaudeBot
Allow: /

# Block AI TRAINING-ONLY crawlers
User-agent: GPTBot
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-agent: Applebot-Extended
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: Bytespider
Disallow: /

User-agent: Meta-ExternalAgent
Disallow: /

Sitemap: https://www.[domain]/sitemap-index.xml

Replace [domain] with the production domain.

LLMS.TXT --- create public/llms.txt:

# [Bedrijfsnaam] - [Type vakman] in [Stad]

> [One-sentence description of services and service area]

## Diensten
- [Dienst 1](https://www.domain.nl/diensten/dienst-1/): [Korte beschrijving]
- [Dienst 2](https://www.domain.nl/diensten/dienst-2/): [Korte beschrijving]

## Informatie
- [Prijzen](https://www.domain.nl/prijzen/): Tarieven en kostenoverzicht
- [FAQ](https://www.domain.nl/veelgestelde-vragen/): Veelgestelde vragen
- [Over ons](https://www.domain.nl/over-ons/): Achtergrond en ervaring
- [Contact](https://www.domain.nl/contact/): Bereikbaarheid en locatie

## Contact
- Telefoon: [+31 nummer]
- E-mail: [email]
- Adres: [straat, postcode stad]
- KvK: [nummer]

Populate with actual data. Keep under 50 lines.
```

---

### ⏸️ HUMAN REVIEW: Copy, Design & Real Photos

> **STOP HERE. Do not proceed to A6 until this review is complete.**
> This is the point where the site transitions from "structurally correct" to "ready for the real world." Technical SEO (A1-A6) is done. Before optimizing performance and deploying, the site needs to look and read like a real business — not a template with placeholder content.

**Review every page in the browser (npm run dev) and fix:**

1. **COPY REVIEW:**
   - Read every page out loud. Does it sound like the business owner talking, or like AI wrote it?
   - Cross-check against `reference-anti-ai-dutch-copywriting.md` red flags (Task 6 checklist)
   - Fix any remaining AI-tell words, unnatural phrasing, or generic copy
   - Verify all business-specific details are accurate (services, pricing, hours, certifications)
   - Check je/jij consistency, Dutch formatting (euro, dates, phone, postcode)

2. **DESIGN REVIEW:**
   - Compare each section against DESIGN.md and homepage-reference.html
   - Fix spacing, color, typography issues
   - Check mobile layout at 375px — compound Dutch words, card stacking, touch targets
   - Verify visual craft elements and decorative elements are present
   - Ensure section padding varies (not uniform py-* across the page)

3. **REAL PHOTOS:**
   - Replace ALL placeholder images with actual client photos
   - Team/owner photos: real photos, not stock
   - Project/portfolio photos: real work the business has done
   - Process all images through Astro's `<Image>` component (src/assets/, not public/)
   - Hero image: loading="eager" fetchpriority="high", max 100KB after optimization
   - Below-fold images: loading="lazy" (Astro default)
   - All images need descriptive Dutch alt text
   - If client has no photos yet: use colored placeholder divs with labels ("[Team foto — wordt aangeleverd]") and flag as blocker for launch

4. **INTERACTIVE COMPONENTS CHECK:**
   - WhatsApp button present and linking to correct number?
   - Google Reviews displaying correctly (if implemented)?
   - Map facade showing correct address?
   - Contact form submitting correctly?
   - Service selector cards linking to correct pages?
   - Before-after slider working (if applicable)?

**When all pages look like a real business site — not a template — continue to A6.**

```
After completing the human review above, commit all changes:

git add -A
git commit -m "fix: copy review, design polish, and real business photos"
```

---

### Prompt A7 --- Performance Optimization

```
Read C:\Users\yanni\Hub\business\sops\reference-conversion-patterns.md (section: "Performance Targets for Dutch Local Services").

Prompt A7: PERFORMANCE OPTIMIZATION.

TARGETS (from CWV-to-conversion research):
- LCP: < 1.5 seconds (conversion gains accelerate below 1.6s --- Renault data)
- CLS: < 0.1
- INP: < 200ms (25% higher CVR for good INP --- Contentsquare)
- TBT: < 200ms
- Lighthouse Mobile: >= 90
- Lighthouse Desktop: >= 95

ARCHETYPE JS BUDGETS:
- A (urgent services): 0 KB JS, CSS-only animations, LCP < 1.0s
- B (portfolio/visual): ~47 KB GSAP allowed, LCP < 1.5s
- C (restaurant/booking): 0-30 KB optional GSAP, LCP < 1.5s
- D (clinical/professional): 0 KB JS, CSS-only, LCP < 1.5s
- E (lifestyle/beauty): 0-30 KB optional GSAP, LCP < 1.5s

This project is archetype [fill in]. Apply the matching budget.

Run through these optimizations:

1. IMAGES:
   - All in src/assets/ (not public/) for Astro build processing
   - Hero: loading="eager", fetchpriority="high", formats=['avif','webp'], widths=[400,800,1200], max 100KB
   - Below-fold: loading="lazy" (Astro default)
   - All: explicit width + height, descriptive Dutch alt text

2. FONTS:
   - Self-hosted WOFF2 (never Google Fonts CDN)
   - Subset to Latin, each file < 30KB
   - Preload ONE critical font weight (hero font)
   - font-display: swap on all @font-face
   - Max 2 families, 3-4 weights total

3. CSS: verify build.inlineStylesheets: 'auto', no render-blocking external sheets

4. JAVASCRIPT:
   - Static pages should ship 0 KB JS
   - Interactive components: client:visible or client:idle, NEVER client:load
   - Total JS budget: under 85KB gzipped (or per archetype budget above)
   - GSAP (if used): load via dynamic import with IntersectionObserver

5. CLOUDFLARE HEADERS --- create/update public/_headers:
   https://:project.pages.dev/*
     X-Robots-Tag: noindex

   https://www.[domain]/*
     Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
     X-Frame-Options: DENY
     X-Content-Type-Options: nosniff
     Referrer-Policy: strict-origin-when-cross-origin
     Permissions-Policy: geolocation=(), camera=(), microphone=()

   /_astro/*
     Cache-Control: public, max-age=31536000, immutable

   /fonts/*
     Cache-Control: public, max-age=31536000, immutable

6. LCP: hero LCP element must NOT start at opacity: 0 (GSAP: min 0.1). No CSS background-image for hero. No loading="lazy" on above-fold images.

7. CLS: all images have width/height. font-display: swap with size-adjust. No post-load layout shifts. Iframes have fixed container dimensions.

Run npm run build to verify clean build.
```

---

### Prompt A8 --- Location Pages

```
Read CONTENT/sitemap.md for the list of service area cities.

Prompt A8: LOCATION PAGES.

Create location/werkgebied pages targeting "[dienst] [stad]" keywords.

STEP 1: Create src/data/locations.ts with typed array:

interface LocationData {
  city: string;
  slug: string;
  province: string;
  postalCodeRange: string;
  coordinates: { lat: number; lng: number };
  population?: string;
  localDetail: string;       // 1-2 unique sentences per city
  neighborhoods?: string[];
  responseTime?: string;
  distanceFromBase?: string;
}

Populate for all service area cities. Each MUST have a unique localDetail.

STEP 2: Create src/pages/werkgebied/[city].astro using getStaticPaths().

Content per page:
1. H1: "[Dienst] in [Stad]"
2. Direct answer paragraph (40-60 words, front-loaded for AI citation)
3. Service overview contextualized to the city
4. Local detail section (localDetail + neighborhoods)
5. Response time / availability
6. Services list linking to diensten pages
7. FAQ section (3-5 location-specific questions)
8. CTA: "Neem contact op voor een vrijblijvende offerte in [stad]"

Minimum 60% unique content per page via localDetail, city-specific FAQ answers, neighborhood names, distance/availability.

STEP 3: Add schema per location page: LocalBusiness with city-specific geo, FAQPage, BreadcrumbList (Home > Werkgebied > [Stad]).

STEP 4: Create/update src/pages/werkgebied/index.astro listing all cities with links.

SWARM VARIANT (10+ cities): use Ruflo swarm coordination to prevent duplicate phrasing. Initialize hierarchical swarm --- queen coordinates uniqueness, workers generate 3-5 pages each, shared memory stores all phrases already used.
```

---

### Prompt A9 --- AI SEO & Answer-First Verification

```
Read CONTENT/faq.md and all service page source files.

Prompt A9: AI SEO OPTIMIZATION.

1. ANSWER-FIRST VERIFICATION:
   Verify every service page and homepage opens with a direct answer paragraph in the first 100 words. Pattern: first 40-60 words directly answer the primary question. If missing, add now.

2. QUESTION-FORMAT H2s:
   Where natural, use question format: "Wat kost een loodgieter per uur?" not "Onze tarieven". Don't force every heading into a question.

3. PRICING TABLES:
   Any pricing content must be in an HTML <table> (2.5x more AI citations than unstructured text).

4. FAQ COVERAGE (adapt to business type):
   - "Wat kost een [dienst]?" (highest AI Overview trigger)
   - "Hoe vind ik een goede [vakman] in [stad]?"
   - "Hoeveel kost het vervangen van [specifiek iets]?"
   - "Wanneer heb je een [vakman] nodig?"
   - "Wat zijn de voordelen van [specifieke dienst]?"
   Each answer: direct answer first sentence, include specific number/price, 30-80 words.

5. FRESHNESS SIGNALS:
   Add "Bijgewerkt: [maand jaar]" to service and FAQ pages. Include dateModified in Article/BlogPosting schema.

6. ENTITY CONSISTENCY:
   - Business name consistent on every page (header, footer, schema)
   - NAP identical: header, footer, contact page, schema, GBP
   - sameAs links to all active profiles
   - E-E-A-T: certifications displayed, experience mentioned, KvK visible

7. INTERNAL LINKING:
   - Homepage links to all service pages + werkgebied
   - Service pages link to homepage, 2-3 related services, contact
   - Location pages link to relevant services + contact
   - FAQ links to service pages
   - Every important page within 3 clicks of homepage
```

---

### Prompt A10 --- Cloudflare Config & Local SEO Handoff

```
Prompt A10: CLOUDFLARE CONFIG + LOCAL SEO HANDOFF.

Read C:\Users\yanni\Hub\business\sops\reference-gbp-optimization.md for the full GBP playbook.

PART 1: Create CLOUDFLARE-SETUP.md in the project root:

## Cloudflare Dashboard Configuration

### Crawler Hints (IndexNow)
Cloudflare Dashboard > [domain] > Caching > Configuration > Enable "Crawler Hints". Auto-sends IndexNow pings to Bing/ChatGPT on content changes. No API key needed.

### AI Crawl Control
Security > Bots > AI Crawl Control > Enable. Allow search crawlers (OAI-SearchBot, PerplexityBot, ChatGPT-User). Block training crawlers (GPTBot, Google-Extended, CCBot).

### SSL/TLS
Full (strict), Always Use HTTPS, Automatic HTTPS Rewrites, minimum TLS 1.2.

### Web Analytics (cookie-free default)
Cloudflare Dashboard > [domain] > Analytics & Logs > Web Analytics > Enable. This runs at CDN level: zero cookies, zero client-side JavaScript, no AVG consent needed. This is the DEFAULT analytics for all client sites. Only add GA4 if the client specifically requests it (requires cookie consent banner).

### Speed
Auto Minify (JS, CSS, HTML), Brotli, Early Hints, HTTP/2 to Origin, HTTP/3 (QUIC).

### Caching
Browser Cache TTL: Respect Existing Headers. Crawler Hints: enabled.

### Custom Domain
www and non-www both work, redirect rule matching canonical, must match astro.config.mjs site.

### Post-Launch Verification
- Rich Results Test on homepage, service page, location page
- Submit sitemap to Google Search Console + Bing Webmaster Tools
- Verify all schema validates
- Lighthouse mobile 90+ on production
- robots.txt and sitemap accessible at production URLs
- Crawler Hints sending IndexNow pings (check Metrics tab after a few days)

PART 2: Create LOCAL-SEO-CHECKLIST.md in the project root.

Reference the GBP optimization data from reference-gbp-optimization.md.

## Google Business Profile

### Profile Completeness
- Claim/verify at business.google.com
- Business name: exact KvK match (no keyword stuffing)
- Primary category: most specific available (see reference-gbp-optimization.md for 15-trade category table)
- 3-4 secondary categories (4 additional categories = highest avg map ranking, position 5.9)
- Address: exact PostNL format, NAP identical to website and schema
- Phone: +31 format matching everywhere
- Website URL: production URL with trailing slash
- Description: 750 characters, include primary service + city + differentiator + certifications
- Opening hours: complete including all Dutch holidays (Koningsdag, Pasen, Kerst, etc. --- see reference for full list)
- Services section: 10-20+ services, enable all pre-defined + add custom, search-friendly Dutch names

### SAB vs Fixed Location Decision
See reference-gbp-optimization.md "Service Area vs. Fixed Location" section. Key: hiding address (SAB) negatively impacts rankings vs showing address. Three options documented there.

## Photo Strategy (from reference-gbp-optimization.md)
- Target: 100+ images total, 2-3 new uploads per week
- Priority: work/project photos + before-after > team photos > exterior > interior
- Specs: 720x720 min general, 1024x576 cover (16:9), 1200x900 posts (4:3)
- Filename: [bedrijfsnaam]-[dienst]-[stad]-[nummer].jpg (never IMG_97833545.jpg)

## Posting Strategy
- 1-2 posts per week, Tuesday-Thursday 9:00-17:00
- Offer/promotion posts get +33% more clicks
- Always include CTA button (+42% engagement)
- 150-300 characters, front-load key message in first 100 chars
- See reference-gbp-optimization.md for Dutch seasonal calendar

## Review Management (from reference-gbp-optimization.md)
- 10 reviews = confirmed ranking boost (Sterling Sky 2025)
- 18-day cliff: rankings fall if no new reviews for ~18 days
- Target: 5-15 reviews/month, steady drip (never in spikes)
- Respond to ALL reviews within 24 hours
- 100% response rate target (only 5% of businesses do this --- competitive gap)
- Personalize every response, naturally include service type + location
- Never use identical templates across responses

## NAP Golden Record (use EVERYWHERE):
Bedrijfsnaam: [exact KvK name]
Adres: [Straatnaam Huisnummer, Postcode Stad]
Telefoon: [+31 XX XXX XXXX]
Website: https://www.[domain].nl
KvK: [nummer]
BTW: [nummer]

## Citation Directories (priority order from reference-gbp-optimization.md):
Tier 1 (first week): GBP, Apple Business Connect, DeTelefoongids.nl, TelefoonBoek.nl, Facebook
Tier 2 (weeks 2-3): Foursquare, Yelp.nl, GoudenGids.nl, NederlandinBedrijf.nl, LinkedIn
Tier 3 (weeks 3-4): Cylex.nl, HotFrog.nl, Opendi.nl, Werkspot (for vakmannen), Trustpilot.nl
```

---

### Prompt A11 --- Final SEO Verification

```
Prompt A11: FINAL SEO VERIFICATION.

Check the actual source code for each item. Report [OK] or [ISSUE].

TECHNICAL SEO:
- Every page has unique <title> (50-60 chars)
- Every page has unique <meta name="description"> (140-155 chars)
- Every page has self-referencing <link rel="canonical"> with trailing slash
- <html lang="nl">
- OG tags on every page (title, description, image, url, type, locale)
- No duplicate titles or descriptions
- robots.txt correctly configured
- sitemap-index.xml generates correctly (run build)
- Legal pages have noindex
- All internal links end with trailing slash
- 404 page exists
- If existing site: all 301 redirects from REDIRECTS.md configured in public/_redirects, no redirect loops

SCHEMA:
- LocalBusiness JSON-LD on every page (via layout)
- BreadcrumbList on every page
- FAQPage on every page with visible FAQ content
- Service on each service page
- All schema data matches GBP data (name, address, phone)
- @id references consistent
- KvK + BTW in LocalBusiness identifier

PERFORMANCE (CWV targets):
- LCP target < 1.5s: hero images eager + fetchpriority="high"
- CLS target < 0.1: all images have width/height
- INP target < 200ms: no client:load on non-critical components
- Fonts self-hosted WOFF2, critical font preloaded, font-display: swap
- _headers file present
- Build output clean, no unused JS bundles

AI SEO:
- Every service page opens with 40-60 word direct answer
- Question-format FAQ headings
- Pricing in HTML <table> elements
- llms.txt exists
- robots.txt: allow AI search, block AI training
- "Bijgewerkt" date visible
- sameAs includes all active profiles

LOCAL SEO:
- Location pages exist for all target cities
- Each has unique content (not city-name swaps)
- City-specific schema with geo coordinates
- NAP consistent across: header, footer, contact, schema, location pages
- KvK visible on every page
- Phone in clickable tel: format

Run npm run build. Report: total pages, schema types, issues found, ready for QA (yes/no).

Commit: git add -A && git commit -m "feat: complete SEO optimization"
```

---

## Sub-session B: QA

### Prerequisites

- Sub-session A complete (all SEO committed)
- Dev server running (`npm run dev`)
- All CONTENT/ files still present for verification

### Prompt B1 --- Lighthouse & CWV Performance Audit

```
Read C:\Users\yanni\Hub\business\sops\reference-conversion-patterns.md (section: "Performance Targets for Dutch Local Services").

Prompt B1: LIGHTHOUSE & CWV AUDIT.

Start dev server: npm run dev

Run Lighthouse on every page. Test MOBILE first (Google indexes mobile), then desktop.

| Page | Mobile Perf | Desktop Perf | A11y | Best Practices | SEO | LCP | CLS | INP/TBT |

PASS CRITERIA (CWV-to-conversion targets):
- Mobile Performance: >= 90
- Desktop Performance: >= 95
- Accessibility: >= 90 (target 100)
- Best Practices: >= 90
- SEO: >= 90
- LCP: < 1.5s mobile (conversion gains accelerate below 1.6s --- Renault study)
- CLS: < 0.1
- TBT: < 200ms mobile
- INP: < 200ms (25% higher CVR for good INP --- Contentsquare)

BLOCKER THRESHOLDS (cannot launch):
- Mobile Performance < 70
- LCP > 4.0s (1-second site converts 3x higher than 5-second site --- Portent data)
- CLS > 0.25
- TBT > 300ms

WHY THESE TARGETS MATTER:
- Lead gen sites: each 0.1s LCP improvement = +21.6% form progression (Deloitte/Google)
- B2B lead gen: 1s load = ~40% CVR, 3s load = ~29% CVR, 5s load = ~20% CVR (Portent)
- Good INP users: +45% CVR on desktop, +11.7% on mobile (Contentsquare)

If any page scores below target:
1. Check Lighthouse "Opportunities" and "Diagnostics"
2. Fix top 3 highest-impact items
3. Re-run after each fix
4. Common Astro fixes: hero image missing fetchpriority="high", component using client:load instead of client:visible, images missing width/height, third-party scripts blocking main thread

Every page must be green (90+) before continuing.
```

-> HUMAN: Review Lighthouse results. Fix any page below 90 mobile performance before continuing.

---

### Prompt B2 --- Image Optimization & Build Size

```
Prompt B2: IMAGE OPTIMIZATION.

Run the /optimize command if available, or manually verify:

1. All images use Astro <Image> component (not raw <img> for local assets)
2. All have width + height (prevents CLS)
3. All have descriptive alt text in Dutch (not "image1.jpg" or empty)
4. Hero images: fetchpriority="high", loading="eager"
5. Below-fold: loading="lazy"
6. No image exceeds 200KB after optimization
7. Format: WebP or AVIF (Astro handles this)

Decorative-only images (SVGs, patterns): alt="" and role="presentation".

Run npm run build and check dist/:
- Total site size?
- Largest page?
- Largest image?

Re-run Lighthouse on homepage after optimization to confirm scores held or improved.
```

---

### Prompt B3 --- Cross-Browser & Responsive Testing

```
Prompt B3: CROSS-BROWSER & RESPONSIVE.

BROWSER MATRIX:
1. Chrome (latest) --- Desktop 1440px + Mobile 375px
2. Safari (latest) --- Desktop 1440px + Mobile iPhone 15
3. Firefox (latest) --- Desktop 1440px + Mobile 375px

PER BROWSER:
- [ ] All pages render without JS console errors
- [ ] Fonts load (match DESIGN.md typography)
- [ ] Images display (no broken icons)
- [ ] Colors match DESIGN.md palette
- [ ] Animations play correctly
- [ ] prefers-reduced-motion: reduce disables animations

RESPONSIVE BREAKPOINTS (Chrome DevTools):
375px, 390px, 768px, 1024px, 1280px, 1440px

AT EACH BREAKPOINT:
- [ ] No horizontal scrollbar
- [ ] Dutch compound words don't overflow (test: "verantwoordelijkheidsgevoel", "arbeidsongeschiktheidsverzekering")
- [ ] hyphens: auto working on headings
- [ ] Navigation usable (hamburger on mobile, full nav on desktop)
- [ ] Touch targets >= 44px on mobile
- [ ] Sticky mobile CTA bar present and functional
- [ ] Images scale without stretching
- [ ] Forms usable on mobile

SAFARI-SPECIFIC:
- [ ] CSS scroll-driven animations have fallback
- [ ] backdrop-filter works or has fallback
- [ ] position: sticky works
- [ ] SVGs render correctly

Report issues with browser, viewport, and screenshot.
```

-> HUMAN: Test on Safari and Firefox yourself. Mobile testing is most critical.

---

### Prompt B4 --- Functional Testing

```
Prompt B4: FUNCTIONAL TESTING.

FORMS:
- [ ] Contact/offerte form submits successfully
- [ ] Validation works (empty, invalid email)
- [ ] Fields have proper Dutch labels and placeholders
- [ ] Button text matches DESIGN.md CTA architecture (NOT "Versturen")
- [ ] Turnstile loads and validates (no visible CAPTCHA)
- [ ] Correct response (thank you message or redirect)
- [ ] Data arrives at destination (email, D1, etc.)
- [ ] Privacy note below form with link to privacybeleid
- [ ] Multi-step form: all steps work, back button, progress indicator

NAVIGATION:
- [ ] All header nav links correct
- [ ] Active page highlighted
- [ ] Mobile hamburger opens/closes, links work, menu closes after nav
- [ ] Logo links to homepage
- [ ] Breadcrumbs correct on subpages
- [ ] Footer nav links work

LINKS:
- [ ] Run: npx broken-link-checker http://localhost:4321 --ordered --recursive
- [ ] All internal links end with trailing slash
- [ ] External links: target="_blank" rel="noopener noreferrer"
- [ ] Phone links: tel: protocol, clickable on mobile
- [ ] WhatsApp: correct wa.me/[number] format
- [ ] Email: mailto: protocol
- [ ] Google Maps link/embed works

404 PAGE:
- [ ] Custom 404 displays at /dit-bestaat-niet/
- [ ] Has navigation back to homepage
- [ ] Matches site design (header, footer)

OTHER:
- [ ] FAQ accordion opens/closes
- [ ] Cookie banner appears on first visit
- [ ] "Accepteren" and "Weigeren" both work
- [ ] Declining cookies prevents tracking scripts from loading

Fix critical issues (forms, navigation, 404) before continuing.
```

---

### Prompt B5 --- Design Diversity Audit (Anti-AI Check)

```
Read DESIGN.md sections 7 (Constraint Cards) and 13 (Anti-Patterns).

Prompt B5: DESIGN DIVERSITY AUDIT.

The site must NOT look AI-generated. This replaces any Stitch fidelity check.

CONSTRAINT CARDS VERIFICATION:
For each constraint card in DESIGN.md section 7:
- [ ] Card 1: [name] --- visible in the final site? Where?
- [ ] Card 2: [name] --- visible in the final site? Where?
- [ ] Card 3: [name] --- visible in the final site? Where?
- [ ] FAQ accordion present (always required for AI SEO)

VISUAL VARIETY (scroll the homepage slowly):
- [ ] Section padding VARIES between sections (NOT uniform py-20 everywhere)
- [ ] At least one full-bleed section (breaks out of max-width container)
- [ ] Grid layouts are NOT all identical (some asymmetric, some offset)
- [ ] At least 2 different layout patterns (not all centered cards)
- [ ] Decorative elements present (SVGs, shapes, patterns, accent lines from BUILD-PLAN.md)
- [ ] At least one section has different background treatment (dark, gradient, texture, color accent)
- [ ] Typography has visual hierarchy beyond font-size (weight, color, spacing variation)
- [ ] Images NOT all same size/treatment (mix: full-width, contained, overlapping, rounded)

AI-GENERATED TELLS (must NOT be present):
- [ ] NOT everything centered in max-w-5xl mx-auto
- [ ] NOT all sections using identical padding (py-20 px-6)
- [ ] NOT all content in uniform card components
- [ ] NOT zero decorative elements
- [ ] NOT everything symmetrically aligned and neatly boxed
- [ ] NOT only basic fade-in-up hover states
- [ ] NOT default Inter/system fonts
- [ ] NOT generic stock photography

Score: constraint cards implemented [X]/[total], AI tells absent [X]/[total].
If any constraint card is missing or an AI tell is present, fix it now.
```

---

### Prompt B6 --- Dutch UX Scorecard

```
Prompt B6: DUTCH UX SCORECARD.

Score each item as Fail (0) / Pass (1) / Excellent (2):

| # | Check | Fail | Pass | Excellent | Score |
|---|-------|------|------|-----------|-------|
| 1 | Trust signals | No reviews, no KvK | Reviews widget + KvK in footer | 10+ embedded reviews with text, KvK + BTW in footer, clickable keurmerk |  |
| 2 | Tone of voice | Wrong formality or aggressive sales | Consistent je/jij, direct and clear | Natural Dutch voice with personality, warmth |  |
| 3 | Contact accessibility | Form only, buried | Phone + form visible, WhatsApp | Sticky bar: "Bel direct" + "App ons" + "Route plannen," local area code |  |
| 4 | Pricing transparency | No pricing info | "Neem contact op voor prijzen" | "Vanaf-prijzen" per service, "Gratis en vrijblijvend offerte aanvragen" |  |
| 5 | Photography | American stock or no images | Some real photos mixed | All custom: team, workspace, completed projects |  |
| 6 | Dutch typography | English-template sizes, wrong formats | Adjusted sizes, correct formatting | Fluid Dutch typography, hyphens:auto, tested with compound words |  |
| 7 | Mobile experience | Desktop-only or broken | Responsive, phone clickable | Mobile-first, sticky CTA bar, 44px targets, Maps, < 3s load |  |
| 8 | Legal compliance | Missing KvK/BTW, no cookie banner | KvK + BTW footer, basic banner | Full legal footer, AP-compliant banner, privacyverklaring, herroepingsrecht |  |
| 9 | "Over ons" page | None or generic | Basic team description | Owner's face + story, team credentials, founding narrative, local connection |  |
| 10 | Cultural authenticity | Feels translated, superlatives, urgency | Natural Dutch, no missteps | Unmistakably Dutch: nuchter but warm, personal but professional |  |

THRESHOLDS:
- 16-20: Excellent --- ready to launch
- 12-15: Good --- address non-Excellent items where feasible
- 8-11: Needs work --- fix all Fails before launch
- Below 8: Do not launch

Items 1 (trust), 3 (contact), 8 (legal) are NON-NEGOTIABLE: must be at least Pass.

For each item below Excellent, note what change would raise it.
```

---

### Prompt B7 --- Accessibility (WCAG 2.1 AA)

```
Prompt B7: ACCESSIBILITY AUDIT.

AUTOMATED:
1. Lighthouse Accessibility (should be >= 90 from B1)
2. Run: npx pa11y http://localhost:4321/ (repeat for key pages)

MANUAL CHECKS:

Color Contrast:
- [ ] Body text on background: 4.5:1 (AA normal text)
- [ ] Large text (18px+ or 14px+ bold): 3:1
- [ ] CTA button text on button background: 4.5:1
- [ ] Text on hero overlay readable
- [ ] Links distinguishable (not just color --- underline or bold)

Keyboard Navigation:
- [ ] Tab through homepage --- reach all interactive elements
- [ ] Tab order follows visual order
- [ ] Focus indicators visible
- [ ] Escape closes modals/menus
- [ ] Skip-to-main-content link on first Tab

Semantic HTML:
- [ ] One <h1> per page, no skipped levels
- [ ] <nav>, <main>, <footer> present
- [ ] Form inputs have <label> elements
- [ ] Required fields: aria-required="true"

ARIA:
- [ ] aria-label on icon-only buttons (hamburger, close)
- [ ] aria-expanded on accordion toggles (FAQ)
- [ ] aria-current="page" on active nav item

Fix any failures. European Accessibility Act applies from 2025.
```

---

### Prompt B8 --- Content Verification & Legal Compliance

```
Prompt B8: CONTENT + LEGAL.

CONTENT --- read all CONTENT/ files and compare against live site:

Copy Check:
- [ ] All headlines match content files exactly
- [ ] All body text present (not truncated or "improved")
- [ ] CTA button text matches DESIGN.md
- [ ] All FAQs present
- [ ] Testimonials match source exactly
- [ ] NAP consistent across all pages

Placeholder Check --- run in codebase:
grep -r "Lorem" src/
grep -r "placeholder" src/ --include="*.astro" --include="*.tsx"
grep -r "TODO" src/ --include="*.astro" --include="*.tsx"
grep -r "example\.com" src/

All must return zero results.

Dutch Formatting:
- [ ] Currency: EUR [bedrag] with space (EUR 49, not $49)
- [ ] Decimals: comma (EUR 2.499,00)
- [ ] Thousands: period (1.500)
- [ ] Dates: "15 maart 2025" (day first, lowercase month)
- [ ] Phone: 06-12345678 or local area code (not +31 on visible site)
- [ ] Postcode: 1234 AB (four digits, space, two uppercase)
- [ ] "Prijzen inclusief BTW" where prices shown

LEGAL COMPLIANCE:

Mandatory Business Info (Art. 3:15d BW):
- [ ] KvK-nummer in footer
- [ ] BTW-nummer in footer
- [ ] Vestigingsadres visible
- [ ] Telefoonnummer + e-mail visible

Cookie Compliance (Telecommunicatiewet + AVG/GDPR):
- [ ] Banner on first visit
- [ ] EQUAL-WEIGHT "Accepteren" and "Weigeren" buttons (AP requirement)
- [ ] Declining actually blocks analytics/tracking
- [ ] Preferences changeable after initial choice
- [ ] Functional cookies load without consent
- [ ] GA4 only loads after explicit consent

Privacy:
- [ ] Privacybeleid page exists, in Dutch
- [ ] Includes: data collected, why, legal basis, retention, rights, contact
- [ ] No mandatory GDPR consent checkbox on contact form (legitimate interest)
- [ ] Privacy note below form: "Door dit formulier in te vullen ga je akkoord met ons privacybeleid"

Report any missing content, wrong formatting, or legal violations.
```

---

### Prompt B9 --- QA Report & Launch Decision

```
Prompt B9: QA REPORT.

Compile results from B1-B8 into a QA report:

## QA Report --- [Client Name]
Date: [date]
Site URL: [dev server URL]

### Performance (B1)
| Page | Mobile | Desktop | Status |
[All must be 90+]
CWV: LCP < 1.5s, CLS < 0.1, INP < 200ms

### Images (B2)
- Total site size: [X] MB
- Largest image: [name] ([size])
- All optimized: Yes/No

### Cross-Browser (B3)
- Chrome: Pass/Fail
- Safari: Pass/Fail
- Firefox: Pass/Fail

### Functional (B4)
- Forms: Pass/Fail
- Navigation: Pass/Fail
- Broken links: [X] (should be 0)
- 404 page: Pass/Fail

### Design Diversity (B5)
- Constraint cards: [X]/[total]
- AI tells absent: [X]/[total]

### Dutch UX (B6)
- Score: [X]/20
- Items below Excellent: [list]

### Accessibility (B7)
- Lighthouse A11y: [X]
- WCAG violations: [count]

### Content + Legal (B8)
- Placeholders: Yes/No
- Dutch formatting: Yes/No
- KvK/BTW visible: Yes/No
- Cookie banner compliant: Yes/No
- Privacy policy: Yes/No

### LAUNCH DECISION
- [ ] All Lighthouse >= 90 mobile
- [ ] CWV targets met (LCP < 1.5s, CLS < 0.1, INP < 200ms)
- [ ] Zero broken links
- [ ] Forms working
- [ ] Legal compliance complete
- [ ] Dutch UX >= 12
- [ ] No placeholder content
- [ ] All constraint cards implemented

**VERDICT: READY FOR LAUNCH / NEEDS FIXES**

If NEEDS FIXES, list items to address.

Use /verification-before-completion before committing --- forces actual evidence checks (Lighthouse runs, build output, screenshots).

Save as QA-REPORT.md in project root.
Commit: git add -A && git commit -m "docs: QA report --- all checks passed"
```

-> HUMAN: Review QA-REPORT.md. If READY FOR LAUNCH, proceed to Sub-session C. If NEEDS FIXES, address each item and re-run relevant prompts.

---

## Sub-session C: Deploy + Handoff

### Prerequisites

- QA-REPORT.md says READY FOR LAUNCH
- Client's domain purchased and accessible
- Cloudflare account active
- Client's Google account email (for GA4 + GSC)
- GitHub account with repo creation access

### Prompt C1 --- Pre-Deploy Verification & GitHub Setup

```
Prompt C1: PRE-DEPLOY + GITHUB.

PRE-DEPLOY:
1. Verify QA-REPORT.md exists and shows READY FOR LAUNCH
2. Run npm run build --- zero errors, zero warnings
3. Check dist/:
   - All pages present (match CONTENT/sitemap.md)
   - robots.txt production-ready
   - sitemap-index.xml contains all URLs
4. Verify astro.config.mjs: site = production URL, trailingSlash: "always", output: 'static'
5. Verify: public/_headers, public/_redirects (www redirect), no .env in git
6. If using cookie-free architecture (default): verify NO cookie banner is present, NO GA4 script loads
   If client requested GA4: verify cookie banner blocks GA4 before consent

GITHUB:
Run the /setup command, or manually:

1. gh repo create [client-name]-website --private --source=. --push

2. Create .github/release-please-config.json:
   { "packages": { ".": { "release-type": "node", "changelog-sections": [
     {"type": "feat", "section": "Features"},
     {"type": "fix", "section": "Bug Fixes"},
     {"type": "chore", "section": "Maintenance"},
     {"type": "docs", "section": "Documentation"}
   ]}}}

3. Create .github/release-please-manifest.json: { ".": "1.0.0" }
4. Create .github/workflows/release-please.yml with Release Please action.

5. git add -A && git commit -m "chore: prepare for production deployment" && git push -u origin master
```

---

### Prompt C2 --- Cloudflare Pages + DNS + SSL

```
Prompt C2: DEPLOY TO CLOUDFLARE.

CLOUDFLARE PAGES:
1. Cloudflare Dashboard > Pages > Create > Connect to Git
2. Select repository, configure:
   - Production branch: master
   - Build command: npm run build
   - Build output: dist
   - Environment: NODE_VERSION=20
3. Save and Deploy. Wait for first build.

Or direct: npm run build && npx wrangler pages deploy dist --project-name=[client-name]

VERIFY PAGES.DEV:
- [ ] *.pages.dev URL loads correctly
- [ ] All pages work
- [ ] curl -I confirms security headers
- [ ] X-Robots-Tag: noindex on pages.dev

DNS:
1. Pages > Custom domains: add [domain.nl] and www.[domain.nl]
2. DNS records:
   - CNAME [domain.nl] -> [project].pages.dev (proxied)
   - CNAME www.[domain.nl] -> [project].pages.dev (proxied)
3. _redirects should handle www redirect

SSL:
- [ ] https://[domain] shows padlock
- [ ] No mixed content (check Console)
- [ ] SSL/TLS mode: Full (Strict)
- [ ] HSTS enabled
- [ ] securityheaders.com: target A+

CLOUDFLARE SETTINGS (from CLOUDFLARE-SETUP.md):
- [ ] Crawler Hints: enabled
- [ ] AI Crawl Control: enabled
- [ ] Auto-Minify: OFF (Astro handles this)
- [ ] Rocket Loader: OFF (conflicts with Astro)
- [ ] Bot Fight Mode: ON (verify doesn't block Googlebot)
```

-> HUMAN: Verify custom domain loads. Test www/non-www redirects. Check SSL.

---

### Prompt C3 --- Forms + Final Production Test

```
Prompt C3: PRODUCTION FORMS + FINAL TEST.

FORMS:
- If using Cloudflare Workers: deploy with npx wrangler deploy
- Create production Turnstile site key for live domain (Cloudflare > Turnstile)
- [ ] Submit form on production URL
- [ ] Turnstile validates on production domain
- [ ] Email notification arrives
- [ ] Validation works (empty, invalid)
- [ ] Test from mobile

FINAL TEST (on production URL, not localhost):
- [ ] Every page loads correctly
- [ ] All forms submit
- [ ] Run: npx broken-link-checker https://[domain] --ordered --recursive
- [ ] Phone links work on mobile
- [ ] Sticky CTA bar appears on mobile
- [ ] Site loads fast (< 3s perceived)

Lighthouse on production:
- [ ] Mobile >= 90
- [ ] Desktop >= 95
- [ ] All four scores green

If any test fails, fix immediately --- the site is live.
```

---

### Prompt C4 --- Analytics & Monitoring

```
Prompt C4: ANALYTICS + MONITORING.

ANALYTICS (DEFAULT: COOKIE-FREE):
Cloudflare Web Analytics is the default for all client sites:
- Already enabled in Prompt A9 (Cloudflare Config)
- Zero cookies, zero client-side JS, no AVG consent needed
- Provides: page views, visits, top pages, top referrers, countries, devices
- Sufficient for 95% of MKB clients who just want "hoeveel mensen bezoeken mijn site?"

GA4 (OPTIONAL --- only if client specifically requests):
1. Create property at analytics.google.com
2. Get Measurement ID (G-XXXXXXXXXX)
3. Verify: loads ONLY after cookie consent (requires CookieConsent by Orestbida)
4. Grant client Editor access
5. Set up events: form_submit, tel: clicks, WhatsApp clicks
6. Basic dashboard: Users, Sessions, Pages, Traffic Sources
Note: adding GA4 means adding a cookie banner, which hurts conversion (banner fatigue). Only add when the client has a specific use case for GA4's advanced features (goal tracking, audience segments, ad integration).

GOOGLE SEARCH CONSOLE:
1. Add property at search.google.com/search-console
2. Verify via DNS TXT record (add in Cloudflare)
3. Submit sitemap: https://[domain]/sitemap-index.xml
4. Grant client Full user access

BING WEBMASTER TOOLS:
Submit sitemap here too --- critical for ChatGPT visibility.

UPTIME MONITORING:
UptimeRobot (free tier: 50 monitors, 5-min interval):
1. Create monitor: HTTPS, URL: https://[domain], interval: 5 min
2. Alert contacts: your email + client email
3. Create public status page (optional): shows uptime % to client
4. Bundle with hosting upsell:
   - EUR 5/mo Basic: hosting on Cloudflare Pages + SSL
   - EUR 10/mo Pro: hosting + 24/7 monitoring + monthly uptime report + priority support
At 20 clients on Pro tier = EUR 200/mo recurring on zero infrastructure cost.

Document all analytics IDs, monitoring URLs, and access credentials for handoff.
```

---

### Prompt C5 --- Client Documentation Package

```
Prompt C5: CLIENT DOCS.

Create these in client-handoff/ folder:

1. WEBSITE OVERVIEW:
   - Live URL, platform (Astro 5 + Cloudflare Pages), launch date
   - Sitemap with all page URLs
   - Key features, analytics links, hosting details

2. CONTENT UPDATE GUIDE (in Dutch):
   - Simple changes: "Stuur e-mail naar [support email] met pagina-URL, huidige tekst, nieuwe tekst. Turnaround: 24-48 uur."
   - Complex changes: "Plan een belafspraak van 15 minuten."
   - Client self-service: post on Google Bedrijfsprofiel, respond to reviews, share URL on social media

3. EMERGENCY PROCEDURES:
   - Site down: check downforeveryoneorjustme.com, then contact us
   - Form broken: test form, check spam, then contact us
   - Wrong info: screenshot + email, fix within 24 hours
   - Security issue: contact us immediately

4. MAINTENANCE SUMMARY (EUR 49/month):
   Included: uptime monitoring, SSL, security updates, broken links, GSC monitoring, ranking tracking, monthly report, 3 text changes/month, 2 image replacements, unlimited hours/contact/testimonial updates, 24hr email response, monthly 15-min call, emergency support.
   Not included (quoted separately): new pages, redesigns, integrations, custom features, content writing, photography.

5. GBP PHOTO STRATEGY BRIEF (from reference-gbp-optimization.md):
   - Upload 2-3 photos per week, build to 100+ total
   - Priority: work photos + before-after > team > exterior
   - Rename files before upload: [bedrijfsnaam]-[dienst]-[stad].jpg
   - Specs: general 720x720+, cover 1024x576, posts 1200x900
   - Customer photos carry 4.6x more trust --- encourage happy clients to add photos

6. REVIEW MANAGEMENT BRIEF (from reference-gbp-optimization.md):
   - 18-day cliff: rankings drop if no new reviews for ~18 days
   - Target: 5-15 reviews/month, steady drip (never spikes)
   - Ask within 24-48 hours of service, ideally after positive interaction
   - Provide direct review link (from GBP dashboard)
   - WhatsApp template: "Hoi [naam], fijn dat we je konden helpen! Als je even tijd hebt, zou een Google review ons enorm helpen: [link]. Alvast bedankt!"
   - Respond to ALL reviews within 24 hours, personalized, never templated
   - 4.2-4.7 stars = sweet spot for trust, 4.7-4.9 = sweet spot for conversion
   - 5.0 stars: 46% of shoppers distrust perfect ratings

Save all in client-handoff/.
```

---

### Prompt C6 --- Handoff Meeting & Completion

```
Prompt C6: HANDOFF.

MEETING AGENDA (30-60 min):

1. Website Tour (15 min): all pages on screenshare, mobile version, submit test form, show conversion flow
2. Analytics Overview (10 min): GA4 together, GSC overview, explain "SEO takes 3-6 months"
3. Google Bedrijfsprofiel (10 min): how to post, respond to reviews, add photos, frequency 1-2x/week
4. How to Request Changes (5 min): review content update guide, clarify included vs extra
5. Q&A (10 min)

PRE-MEETING EMAIL:
Subject: Morgen: je nieuwe website is live!

Hi [Client Name],

Morgen om [time] lopen we samen door je nieuwe website. Ik laat je zien:
- Hoe de website eruitziet (desktop + mobiel)
- Hoe je Google Analytics en Search Console kunt bekijken
- Hoe je je Google Bedrijfsprofiel kunt bijhouden
- Hoe je wijzigingen kunt doorgeven

Je hoeft niets voor te bereiden. Neem wel je laptop mee zodat je mee kunt kijken.

Tot morgen!
[Your name]
KNAP GEMAAKT.

MAINTENANCE SETUP:
- [ ] UptimeRobot active and alerting
- [ ] Monthly reporting template created
- [ ] First report date scheduled
- [ ] Maintenance invoice sent (recurring via Mollie/Stripe)

ACCESS --- provide to client (via secure method, NOT plain email):
- [ ] Domain registrar login + renewal date
- [ ] GA4 access (Editor)
- [ ] GSC access (Full user)
- [ ] GBP access (Manager)
- [ ] Form submission destination email

Retain (do NOT share): GitHub, Cloudflare, API keys, Worker/D1 credentials.

LEGAL:
- [ ] Ownership: client owns domain, content, branding. Code/design licensed for use.
- [ ] Maintenance agreement signed (start date, EUR 49/month, terms, cancellation)
- [ ] SLA: 99.9% uptime, 24hr non-critical, 2hr critical

POST-HANDOFF EMAIL:
Subject: Je nieuwe website is live!

Hi [Client Name],

Gefeliciteerd! Je nieuwe website staat live op [URL].

Hierbij het complete pakket:
- Websitedocumentatie en sitemap
- Handleiding voor wijzigingen
- Noodprocedures
- Samenvatting onderhoudspakket

Toegang en inloggegevens:
- [Veilige link naar wachtwoorddocument]

Opname van de uitleg-sessie:
- [Link naar opname]

Wat er nu gebeurt:
- We monitoren je website 24/7
- Het eerste maandrapport ontvang je op [datum]
- Bij vragen: mail naar [support email] of bel [telefoon]

Succes met je bedrijf!

[Your name]
KNAP GEMAAKT.

Commit: git add -A && git commit -m "docs: client handoff package complete"
```

-> HUMAN: Conduct handoff meeting. Send welcome email. Project enters maintenance mode.

---

## Sub-session D: Post-Launch

### Prerequisites

- Site live on production domain
- GA4 + GSC configured and tracking
- UptimeRobot active
- Handoff meeting conducted

### Prompt D1 --- Week 1 Health Check (5-7 days after launch)

```
Prompt D1: WEEK 1 HEALTH CHECK on [production URL].

UPTIME:
- [ ] UptimeRobot: any downtime?
- [ ] Visit production URL right now --- loads correctly?
- [ ] Cloudflare Analytics: error spikes (4xx, 5xx)?
- [ ] Cloudflare Security: threats blocked? Legitimate traffic blocked?

FORMS:
- [ ] Submit test form on production right now
- [ ] Email notification arrives
- [ ] Check if submissions went to spam

ANALYTICS:
- [ ] GA4 collecting data? Page views across multiple pages?
- [ ] Cookie banner working? (look for consent events)
- [ ] Real-time view shows activity when browsing

GOOGLE SEARCH CONSOLE:
- [ ] Sitemap processed?
- [ ] Indexing: how many pages indexed?
- [ ] Any crawl errors?
- [ ] Any manual actions? (should be none)

GBP (from reference-gbp-optimization.md):
- [ ] Profile complete? All fields filled?
- [ ] Primary category correct? (check 15-trade table in reference)
- [ ] Holiday hours set for next upcoming Dutch holiday?
- [ ] First 10+ photos uploaded?

TECHNICAL:
- [ ] Lighthouse on production --- still 90+?
- [ ] CWV targets: LCP < 1.5s, CLS < 0.1, INP < 200ms?
- [ ] No new console errors
- [ ] Run: npx broken-link-checker https://[domain] --ordered --recursive

CLIENT CHECK-IN:
Send message:

"Hi [Client Name],

Je website staat nu een week live. Een paar vragen:
1. Heb je al reacties ontvangen via het contactformulier?
2. Heb je al klanten gehad die zeiden dat ze je via de website gevonden hebben?
3. Zit er iets op de website dat je graag aangepast wil hebben?

Laat het even weten, dan pak ik het meteen op.

Groet,
[Your name]"

Save as WEEK-1-REPORT.md. Fix critical issues immediately.
```

-> HUMAN: Send client check-in message.

---

### Prompt D2 --- Client Satisfaction + Review Request (14 days after launch)

```
Prompt D2: 2-WEEK CHECK-IN + REVIEW REQUEST.

Send satisfaction survey (email or WhatsApp):

"Hi [Client Name],

Je website is nu twee weken live --- tijd voor een korte check-in!

Vijf snelle vragen (reply is genoeg):

1. Doet de website wat je ervan verwacht had? (Ja / Nee / Deels)
2. Heb je reacties gehad van klanten over de website?
3. Vind je het makkelijk om het analytics-dashboard te bekijken? (Ja / Nee / Hulp nodig)
4. Heb je nog vragen over het onderhoudspakket? (Ja / Nee)
5. Zou je ons aanraden bij een andere ondernemer? (1-10)

Bedankt!
[Your name]
KNAP GEMAAKT."

PROCESS RESPONSE:
- Score 8+: proceed to review request (below)
- Score 6-7: ask what to improve, address, then ask again
- Score below 6: schedule a call immediately

REVIEW REQUEST (only if score 8+):
"Hi [Client Name],

Fijn om te horen dat je blij bent met de website!

Mag ik je iets vragen? Een Google Review zou ons enorm helpen --- andere ondernemers kijken daar naar als ze een webbureau zoeken, net zoals jouw klanten naar jouw reviews kijken.

Het kost maar 2 minuutjes: [direct Google Review link]

Een paar zinnen over je ervaring is al meer dan genoeg. Uiteraard helemaal vrijblijvend!

Alvast bedankt,
[Your name]"

Generate direct review link: GBP > Homepage > "Ask for reviews" or https://g.page/r/[place-id]/review.

If they leave a review: respond publicly within 24 hours with personal thank-you.

Save notes as CLIENT-FEEDBACK.md.
```

-> HUMAN: Send satisfaction survey. Send review request if appropriate.

---

### Prompt D3 --- Month 1 Performance Report (30 days after launch)

```
Prompt D3: MONTH 1 REPORT.

Pull from GA4 (30 days):
- Total users, sessions, pageviews, avg session duration, engagement rate
- Traffic sources: Organic, Direct, Referral, Social
- Top 10 pages by views
- Device breakdown (mobile/desktop/tablet)
- Geographic breakdown (cities/regions)

Pull from GSC (30 days):
- Total clicks, impressions, avg CTR, avg position
- Top 20 queries
- Top pages by clicks
- Indexing status: pages indexed vs submitted
- Crawl errors

Pull from GBP (if accessible):
- Profile views, search queries, calls, website clicks, direction requests

FORMAT THE REPORT:

# Maandrapport --- [Client Name]
Periode: [launch date] t/m [report date]
Website: [production URL]

## Samenvatting
[2-3 sentences: highlights, performance, trends]

## Verkeer
- Totaal bezoekers: [X]
- Sessies: [X]
- Paginaweergaven: [X]
- Gemiddelde sessieduur: [X:XX]

## Verkeersbronnen
| Bron | Bezoekers | % |
| Google (organisch) | X | X% |
| Direct | X | X% |
| Verwijzingen | X | X% |
| Sociaal | X | X% |

## Populairste pagina's
| Pagina | Weergaven |

## Google Search Console
- Klikken: [X]
- Vertoningen: [X]
- Gemiddelde positie: [X]
- Top zoekopdrachten: [top 5-10]

## Google Bedrijfsprofiel
- Profielweergaven: [X]
- Websiteklikken: [X]
- Oproepen: [X]
- Routeverzoeken: [X]

## Aandachtspunten
[What's going well, what could improve, recommendations]

## Volgende maand
[Focus: keyword optimization, content suggestions, GBP activity]

Send to client:
"Hi [Client Name], hierbij het eerste maandrapport van je website. [1-2 sentence summary]. Wil je de cijfers even doorspreken? Dan plannen we een kort belletje.

Groet,
[Your name]
KNAP GEMAAKT."

Save as MONTH-1-REPORT.md.
```

-> HUMAN: Review report and send to client.

---

### Prompt D4 --- Keyword Refinement (after Month 1 report)

```
Prompt D4: KEYWORD REFINEMENT from GSC data.

Read the Month 1 report's top 20 queries.

IDENTIFY OPPORTUNITIES:

1. HIGH IMPRESSIONS, LOW CTR (position 5-15):
   Google shows us but people don't click. Check title + meta description. Rewrite to better match these queries.

2. HIGH IMPRESSIONS, HIGH POSITION (1-5):
   Already winning. Don't change, just monitor.

3. UNEXPECTED QUERIES:
   Terms we didn't target but get impressions. Consider new content or FAQ additions.

4. MISSING LOCAL QUERIES:
   No "[service] [city]" queries? Check LocalBusiness schema, city in H1/title/body, GBP linked.

5. LONG-TAIL QUESTIONS:
   "Wat kost...", "hoe werkt...", "waar vind ik..." --- add as FAQ questions on relevant pages.

IMPLEMENT:
For each optimization:
1. Make the change (title, meta, FAQ)
2. Note original + new text
3. Commit: "seo: optimize meta for [keyword] based on GSC data"
4. Track:
   | Query | Old Title/Meta | New Title/Meta | Date | Position Before | Position After (30 days) |

Deploy changes. Wait 2-4 weeks before further changes to same pages.
```

---

### Prompt D5 --- Design Gene Extraction

```
Prompt D5: DESIGN GENE EXTRACTION.

Read: DESIGN.md, BUILD-PLAN.md, STITCH-DESIGN-CONTEXT.md (if exists), the final built site.

Extract into a Design Gene file:

1. PALETTE: primary/secondary/accent/background/text hex, CTA button color, section background colors, any adjustments from DESIGN.md vs final
2. TYPOGRAPHY: heading + body fonts/weights, type scale, special treatments
3. LAYOUT PATTERNS: hero type, grid structures (col-spans), full-bleed vs contained, section padding per section, how asymmetry was achieved
4. ANIMATION & EFFECTS: level, specific effects with CSS/GSAP approach, highest impact effects
5. DECORATIVE ELEMENTS: sprinkles used, placement per section, custom SVGs
6. SECTION ORDER: final homepage order (may differ from DESIGN.md)
7. CONSTRAINT CARDS: which drawn, how implemented, which had most impact
8. WHAT WORKED / WHAT DIDN'T: best client reaction, hardest to implement, what to do differently, QA issues from design choices

FORMAT as YAML frontmatter + markdown:

---
name: "[Client Name] Design Gene"
project: "[client-name]-website"
date: [launch date]
archetype: [A/B/C/D/E]
business_type: "[e.g., hovenier]"
location: "[city, region]"
palette:
  primary: "#XXXXXX"
  secondary: "#XXXXXX"
  accent: "#XXXXXX"
  background: "#XXXXXX"
  text: "#XXXXXX"
  cta_button: "#XXXXXX"
typography:
  heading_font: "[font]"
  heading_weight: [weight]
  body_font: "[font]"
  body_weight: [weight]
  scale: "52/36/24/16/14"
hero_type: "[split/full-bleed/typography/cta-first/booking/before-after]"
animation_level: [X]
constraint_cards:
  - "[Card 1]"
  - "[Card 2]"
  - "[Card 3]"
effects_used:
  - "[effect 1]"
  - "[effect 2]"
sprinkles_used:
  - "[sprinkle 1]"
  - "[sprinkle 2]"
tags:
  - "[business-type]"
  - "[archetype]"
  - "[city]"
  - "[region]"
---

# [Client Name] Design Gene

## Palette
[Color mood and usage across sections]

## Typography
[Font pairing, business personality fit]

## Layout Patterns
[Grid structures, widths, asymmetric patterns]

## Effects & Animations
[Each effect with implementation approach]

## Decorative Elements
[Each sprinkle with placement and impact]

## Section Order
[Final homepage sections with layout description]

## Key Code Snippets
[2-3 reusable: GSAP config, SVG shape, grid pattern]

## Lessons Learned
[What worked, what didn't, advice for this business type]

SAVE TO: Hub/business/design-genes/[business-type]/[client-name].md
Create subdirectory if needed.

Commit in Hub:
cd [Hub path]
git add business/design-genes/
git commit -m "gene: add [client-name] [business-type] design gene"
```

---

### Prompt D6 --- Project Wrap-Up

```
Prompt D6: PROJECT WRAP-UP.

VERIFY these files exist:
- [ ] DESIGN.md (Session 1)
- [ ] CONTENT/ folder (Session 2)
- [ ] BUILD-PLAN.md (Session 3)
- [ ] QA-REPORT.md (Session 4B)
- [ ] WEEK-1-REPORT.md (Session 4D)
- [ ] CLIENT-FEEDBACK.md (Session 4D)
- [ ] MONTH-1-REPORT.md (Session 4D)
- [ ] client-handoff/ folder (Session 4C)

ARCHIVE:
- [ ] All documentation committed to git
- [ ] GitHub repository clean (no stale branches, no sensitive data)
- [ ] Design Gene extracted and saved to Hub

ONGOING MAINTENANCE (monthly):
- Lighthouse audit (verify scores hold)
- CWV check: LCP < 1.5s, CLS < 0.1, INP < 200ms
- GSC: crawl errors, new keyword opportunities
- GBP: review velocity (18-day cliff!), photo uploads, holiday hours
- UptimeRobot: downtime incidents
- Monthly report to client
- Respond to new Google Reviews within 24 hours
- Apply content updates as requested
- Astro/dependency security updates (quarterly)

PROCESS IMPROVEMENT:
Note improvements to SOP:
- What took longer than expected?
- What could be automated?
- What did the client ask about that we didn't cover?
- New tools or techniques discovered?

Save to: Hub/business/sops/process-improvement-notes.md (append).

Final commit:
git add -A && git commit -m "docs: project complete --- entering maintenance"
```

-> HUMAN: Project is now in maintenance mode. Monthly cycle begins.

---

## Troubleshooting

**Lighthouse scores drop after adding analytics/tracking:**
Move GA4 to load via Partytown (web worker) or defer until after cookie consent.

**Dutch compound words overflow on mobile:**
Verify `hyphens: auto` on headings + `<html lang="nl">`. Add `overflow-wrap: break-word` as fallback. Test: "verantwoordelijkheidsgevoel", "arbeidsongeschiktheidsverzekering".

**Cookie banner fails AP compliance:**
Both "Accepteren" and "Weigeren" must be equally styled buttons (same size, same weight). Test that declining actually prevents GA4/tracking.

**Cloudflare Pages build fails:**
Check build logs. Common: wrong Node version (set NODE_VERSION=20), missing deps, Astro config referencing localhost.

**DNS not propagating:**
Cloudflare DNS: usually instant. External: up to 48 hours. Check with `nslookup [domain]`.

**Forms don't work on production but worked locally:**
Turnstile site key is domain-specific. Create production key. Check CORS on Worker. Verify form action URL.

**Lighthouse lower on production than local:**
Third-party scripts (GA4, Turnstile) add overhead. Disable Cloudflare Auto-Minify and Rocket Loader (conflicts with Astro).

**GA4 shows no data after week 1:**
Check cookie banner isn't blocking entirely. Verify Measurement ID matches. Check ad blockers. Cloudflare Web Analytics as fallback.

**GSC shows zero indexed pages after week 1:**
Verify sitemap submitted. Check robots.txt. Manually request indexing of homepage. New domains: 1-4 weeks is normal.

**Month 1 traffic very low:**
Normal for new domains. Organic takes 3-6 months. Ensure GBP active with weekly posts. Share URL on social, email signatures, business cards. Submit to local directories.

**GBP rankings not improving:**
Check review velocity (18-day cliff). Verify primary category is most specific available. Upload photos weekly. Set holiday hours. See reference-gbp-optimization.md for full playbook.
