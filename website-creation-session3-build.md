# Session 3 -- Website Build

> Single session. ~2-3 hours. Output: Working Astro 5 site.
> Input: DESIGN.md, SITEMAP-DRAFT.md, CONTENT/, homepage-reference.html, inner page references (from Session 1 Prompt 4b — one per page type)
> Skills: `frontend-design` / Impeccable (active for ALL page generation — `/audit`, `/normalize`, `/polish`)
> MCPs: `magic__21st`, `magicui`, `shadcn`, `hugeicons`, `uiuxpro`
> Prerequisites: Session 1 complete (DESIGN.md + homepage-reference.html), Session 2 complete (CONTENT/ folder with all copy), Node.js installed

---

## Prompts

### Prompt 0 -- Git Checkpoint

```
Commit all Session 1 and Session 2 work:

git add DESIGN.md CONTENT/ homepage-reference.html competitor-reference/
git commit -m "content: complete Session 1 design direction + Session 2 copywriting"
```

---

### Prompt 1 -- Build Plan

```
Read these files in order:
1. DESIGN.md (all sections -- archetype, animation level, constraint cards, tone scores, palette, typography)
2. Hub/business/sops/reference-effects-library.md (read section 6: Intensity Mapping Table per Archetype)
3. Hub/business/sops/reference-visual-craft-library.md (read the selection guide table at the top)
4. Hub/business/sops/reference-component-catalog.md (full file -- framework-agnostic section + archetype quick pick)

Now create BUILD-PLAN.md with these sections:

## Layout Patterns
Select 2-3 layout patterns from competitor-reference/*.html files. For each, note:
- Source file and section
- Grid structure (column spans, breakpoints)
- Why it fits this archetype

## Effects Selection
Look up this project's archetype (A-E) in the intensity mapping table. Select ONLY effects rated 3+ for this archetype. List each effect with:
- Name and intensity score
- Which section it applies to
- CSS-only or requires GSAP (check JS budget for this archetype)

## Visual Craft Elements
Pick 3-5 decorative elements from the visual craft library rated 2+ stars for this archetype:
- Element name and code reference
- Which section it goes in
- Color values mapped to project palette

## Component Choices

COMPONENT RESEARCH -- run before making any decisions:

1. shadcn MCP `list_themes`: Browse available themes. Pick 1 as a baseline for
   any React components chosen. Note the theme name -- it will be applied in Prompt 2.

2. shadcn MCP `list_components`: Browse all available components. For each interactive
   element needed (accordion, form, nav dropdown, tabs, dialog), call `get_component_demo`
   to see the actual implementation before deciding framework-agnostic vs shadcn.

3. magic__21st MCP `21st_magic_component_inspiration`: For the hero section and the
   2 most visually important homepage sections (from DESIGN.md section order), run
   inspiration scans. Note any patterns achievable in Astro that couldn't be done
   in the reference HTML's static inline CSS.

4. magicui MCP `listRegistryItems`: See all available animated components.
   Cross-reference with BUILD-PLAN.md effects list -- note where a magicui component
   could replace a custom CSS animation (number counters, text reveals, border beams,
   spotlight effects, scroll-driven animations).

DECISION ORDER (apply after research above):
1. Framework-agnostic first (Preline, Flowbite, DaisyUI) -- zero JS overhead
2. React-based (shadcn, Magic UI, magicui) ONLY if interactivity or animation requires it
3. 21st.dev `21st_magic_component_builder` for complex UI with no library match

For each component chosen, note: name, source library, whether it needs client:load

## Interactive Patterns
Based on Prompt 1's interactive pattern recommendation from Session 1:
- If Pattern C (card selector) was recommended: note it here, confirm JSON data structure (title, icon, description, href per card)
- If Pattern D (cost calculator) was recommended as upsell: note it, confirm pricing data model, confirm Preact dependency added
- If Pattern A (guided quiz) was recommended: note step count, data model, confirm vanilla JS approach
- If none beyond standard nav: note "Standard navigation sufficient — no interactive selector needed"

## Anti-Patterns
Copy the anti-patterns from DESIGN.md section 13. Add:
- No opacity:0 on hero elements (LCP trap)
- No uniform py-* on 3+ consecutive sections
- No centered-everything layout
- No identical card components across sections
```

--> HUMAN: Review BUILD-PLAN.md. Confirm effect and component selections. Flag anything that feels wrong for the client's industry.

---

### Prompt 2 -- Project Scaffold

```
Read DESIGN.md (palette, typography, section order) and CONTENT/sitemap.md.

Initialize the Astro 5 project:

1. Run: npm create astro@latest . -- --template minimal --no-install --typescript strict
2. Install dependencies:
   npm install astro@5 tailwindcss@4 @tailwindcss/vite
   Only add @astrojs/react react react-dom if BUILD-PLAN.md lists any React-based components. Otherwise skip React entirely.

   If BUILD-PLAN.md selected any shadcn components:
   - Run: npx shadcn@latest init (accept defaults, confirm tailwind v4 path)
   - Run: npx shadcn@latest add [component names from BUILD-PLAN.md]
   - Then use shadcn MCP `apply_theme` with the client's color values from DESIGN.md
     to replace the default shadcn CSS variables. This ensures all shadcn components
     use the correct palette from the start -- not the default slate/zinc theme.
   - Use shadcn MCP `get_theme` on the theme selected in BUILD-PLAN.md component research
     to verify the token mapping before applying.

3. Configure astro.config.mjs:
   - trailingSlash: "always"
   - output: "static"
   - Tailwind via @tailwindcss/vite plugin
   - Add @astrojs/react integration ONLY if installed above

4. Create src/styles/global.css:
   - @import "tailwindcss"
   - @theme block with ALL design tokens from DESIGN.md:
     - Full color palette as CSS custom properties
     - Font families (with Google Fonts fallback stack)
     - Border radius values
     - Spacing scale if custom
     - Animation keyframes: fade-up, scale-reveal
   - @layer base:
     - body: font-family, color, background, overflow-wrap: break-word
     - button, [role="button"]: cursor: pointer, min-width: 200px
     - headings: font-size with clamp() for responsive scaling

5. Create src/styles/effects.css:
   - animation-timeline utilities (anim-timeline-view, anim-range-entry, etc.)
   - Scroll fade-up base class
   - prefers-reduced-motion: reduce handling

6. Create src/layouts/Layout.astro:
   - lang="nl"
   - Google Fonts link (preconnect + stylesheet)
   - Import global.css and effects.css
   - ClientRouter for page transitions
   - Slot for page content
   - Meta viewport, charset

7. Create empty page shells from CONTENT/sitemap.md:
   - src/pages/index.astro
   - src/pages/diensten/[each service].astro or content collection
   - src/pages/over-ons/index.astro
   - src/pages/contact/index.astro
   - src/pages/faq/index.astro
   - src/pages/privacy/index.astro
   - src/pages/voorwaarden/index.astro
   Each shell: just Layout import + empty main tag with page title comment

8. COOKIE-FREE DEFAULT:
   The default architecture uses NO cookies and requires NO cookie banner:
   - Analytics: Cloudflare Web Analytics (CDN-level, zero cookies, zero client-side JS)
   - Maps: Static image with "Open in Google Maps" link (zero cookies)
   - Reviews: Build-time fetched via CF Worker, rendered as static HTML (zero cookies)
   - Contact form: Cloudflare Worker + Turnstile (zero cookies)
   Only add a cookie consent tool (CookieConsent by Orestbida) if client specifically requires GA4, YouTube embeds, or interactive Google Maps iframe.

9. Run npm run build -- verify zero errors before proceeding.
```

---

### Prompt 3 -- Homepage Build

```
Use the frontend-design skill for this entire prompt.

Read these files before building anything:
1. DESIGN.md -- design tokens, section order, CTA architecture, trust signals, constraint cards
2. CONTENT/homepage.md -- all real Dutch copy for every section
3. BUILD-PLAN.md -- selected effects, components, craft elements, anti-patterns
4. homepage-reference.html -- layout INSPIRATION only (do NOT convert this HTML)
5. competitor-reference/*.html -- professional layout patterns to draw from

Build src/pages/index.astro with the full homepage. Build it as native Astro components -- NOT by converting homepage-reference.html to Astro. The reference HTML is inspiration for layout decisions, not source code.

ICON SETUP (run once before building sections):
For every icon used on this page (service cards, nav, footer, process steps, trust badges):
- Use hugeicons MCP `search_icons` with the icon concept (e.g., "wrench", "leaf", "check",
  "phone", "star", "arrow right")
- Then call `get_icon_glyph_by_style` with the icon name and the style that matches the
  typography personality from DESIGN.md (clean geometric → "stroke", rounded → "solid",
  expressive → "duotone")
- Embed as inline SVG directly in the component -- never use font-based icon libraries
  or img tags for icons

SECTION-BY-SECTION BUILD:
Follow the section order from DESIGN.md. For each section:
- Use the component chosen in BUILD-PLAN.md
- If the section type wasn't in BUILD-PLAN.md or requires a decision, first call
  uiuxpro MCP `search_components` with the section type before improvising
- Insert the EXACT Dutch copy from CONTENT/homepage.md (no placeholders, no Lorem ipsum)
- Apply the visual craft element assigned to this section in BUILD-PLAN.md
- Vary padding: never use the same py-* value for 3 consecutive sections

EXTRACT THESE AS REUSABLE COMPONENTS in src/components/:
- Header.astro -- navigation, logo, phone number, CTA button, mobile menu
- Footer.astro -- nav links, legal info, KvK, BTW, contact details, opening hours
- CtaSection.astro -- reusable call-to-action block (used between sections and on subpages)
- ContactForm.astro -- form with fields from DESIGN.md section 9, Turnstile placeholder
- WhatsAppButton.astro -- floating button (bottom-right, position: fixed), pure HTML/CSS, wa.me link with pre-filled text. Zero JS, zero cookies. CONDITIONAL: only include when the Contact Method Matrix (reference-business-type-blueprints.md) lists WhatsApp as primary or secondary channel for this business type. Skip for B2B-dominant niches (schoonmaak, bouw, installateurs) where it undercuts professional positioning. When used alongside a sticky mobile CTA bar, position the WhatsApp button ABOVE the bar (bottom-20) to avoid overlap.
- GoogleReviews.astro -- displays Google reviews fetched at build time (static HTML). Data source: Cloudflare Worker that fetches Places API daily and caches in KV. Props: placeId, maxReviews. Renders star SVGs + review text + attribution. Zero JS at runtime.
- MapFacade.astro -- static map image (WebP) with "Bekijk op Google Maps" link opening in new tab. Props: address, lat, lng, mapImageUrl. Zero cookies, zero iframe, perfect CWV. Only load interactive iframe on explicit user click if needed.
- BeforeAfter.astro -- (CONDITIONAL: archetype B visual trades only) img-comparison-slider web component (7.5 kB). Props: beforeSrc, afterSrc, beforeAlt, afterAlt. Self-initializing web component, no client:load needed. Include only when BUILD-PLAN.md selects C5.
- ServiceSelector.astro -- (DEFAULT for 3+ services) clickable card grid linking to service pages. Props: services[] (title, icon, description, href, color). Zero JS — uses accessible pseudo-element stretch pattern (a::after { position: absolute; inset: 0 }) for full-card clickability. Wrap in <nav aria-label="Onze diensten">. Responsive: grid-cols-1 sm:grid-cols-2 lg:grid-cols-3. Configure via JSON import from src/data/services.json. Include only when BUILD-PLAN.md selects C6.
- CostCalculator.astro -- (PREMIUM UPSELL only, conditional) Preact island with client:visible. Props: config from src/data/calculator.json (inputs, pricing model, disclaimer). Render static pricing table + FAQ ABOVE the calculator for SEO. Include <noscript> fallback. Only when BUILD-PLAN.md selects C7 AND project price is EUR 2,000+.

CRITICAL BUILD RULES:
- Use CSS variables from global.css for ALL colors -- never hardcode hex values in components
- Use framework-agnostic components (Preline/Flowbite/DaisyUI HTML+Tailwind) unless BUILD-PLAN.md specifically chose a React component for interactivity
- Include asymmetric layouts where the archetype calls for it -- not everything max-w-5xl mx-auto centered
- Apply decorative elements from BUILD-PLAN.md: SVG shapes, blur blobs, gradients, accent lines
- Dutch character budgets: buttons min-w-[200px], headings use clamp() from global.css
- Hero images: loading="eager" fetchpriority="high". Below-fold images: loading="lazy"
- NEVER set hero elements to opacity: 0 (LCP trap -- use opacity: 0.1 minimum if animating)
- Every visual choice must trace to a reference (anti-nothing rule): DESIGN.md, BUILD-PLAN.md, competitor HTML, or reference library
- All internal links end with trailing slash

After building, run npm run dev to verify the page renders.
```

--> HUMAN: Run `npm run dev`. Open the homepage in your browser. Review each section. Request specific changes if needed -- for example: "make the services section use an editorial layout instead of cards", "hero needs more contrast between heading and background", "add more whitespace before the CTA section". Claude edits components in place. No full-page regeneration.

---

### Prompt 4 -- Parallel Subpage Build

```
Use the frontend-design skill for ALL pages.

Build the remaining pages from CONTENT/. For each page:
- Read DESIGN.md for design tokens and visual consistency rules
- Read the relevant CONTENT/ file for all Dutch copy
- Read the matching inner page reference HTML from Session 1 (service-page-reference.html, blog-post-reference.html, about-contact-reference.html) for layout direction
- Reuse Header.astro, Footer.astro, CtaSection.astro from the homepage build
- Match the homepage visual style (same palette, typography, spacing rhythm) but vary layouts -- do NOT duplicate the homepage grid structures
- Apply visual craft elements from BUILD-PLAN.md appropriate to each page type
- Use real copy only -- zero placeholders
- All internal links end with trailing slash

Pages to build:

SERVICE PAGES:
- If using content collections: create src/content/diensten/ with .md files from CONTENT/diensten/*, define collection schema, build src/pages/diensten/[...slug].astro template
- If static pages: create src/pages/diensten/[service-name]/index.astro for each service
- Each service page: hero with service name, description, benefits/features section, process steps, relevant FAQ, CTA section
- Cross-link to 2 related services ("Ook interessant")

ABOUT PAGE: src/pages/over-ons/index.astro
- From CONTENT/over-ons.md
- Team/founder story, values, credentials, certifications

CONTACT PAGE: src/pages/contact/index.astro
- From CONTENT/contact.md
- ContactForm.astro component, business details sidebar (address, phone, email, hours), map placeholder

FAQ PAGE: src/pages/faq/index.astro
- From CONTENT/faq.md
- Accordion component (use framework-agnostic <details>/<summary> unless React accordion chosen in BUILD-PLAN.md)
- Group questions by category if CONTENT provides categories
- Link answers to relevant service pages

LEGAL PAGES:
- src/pages/privacy/index.astro from CONTENT/privacy.md
- src/pages/voorwaarden/index.astro from CONTENT/voorwaarden.md
- Simple text layout with established typography, no decorative elements needed

After all pages, run npm run build -- zero errors.
```

Note: If using Claude Code, you can dispatch parallel agents for independent page groups (e.g., one agent for service pages, one for about+contact, one for FAQ+legal). If working manually, build sequentially in the order above.

---

### Prompt 5 -- Effects Layer

```
Read BUILD-PLAN.md for the selected effects list.

Add the effects layer to all built pages. This is where motion and interaction get applied.

MAGICUI CHECK -- run before writing any custom animation code:
For each animation type in BUILD-PLAN.md effects list, check if magicui has it:

Use magicui MCP `searchRegistryItems` with these queries:
- Number/stat counters → "number", "counter", "animated number"
- Text animations → "text", "typing", "shimmer", "word"
- Scroll reveals → "reveal", "fade", "border-beam", "shine"
- Background effects → "spotlight", "grid", "particles", "aurora", "meteors"
- Loading/skeleton → "skeleton", "pulse"

For any match: call `getRegistryItem` to get the full component code and README.
Use the magicui component instead of a custom implementation where available --
it handles accessibility, reduced motion, and browser compatibility automatically.

Only proceed with custom CSS or GSAP for effects NOT found in magicui.

For each selected effect from BUILD-PLAN.md:

1. CSS SCROLL EFFECTS (animation-timeline approach):
   - Add scroll fade-up to section headings and content blocks (max per BUILD-PLAN.md count)
   - Use the .anim-timeline-view and .anim-range-entry utilities from effects.css
   - Stagger reveal on card groups: add animation-delay (0ms, 100ms, 200ms, 300ms)
   - Scale reveal on images where specified

2. HOVER STATES:
   - Card lift: translateY(-4px) + shadow increase on hover
   - Button states: scale(1.02) + shadow or color shift
   - Image overlay: grayscale-to-color or overlay fade
   - Wrap ALL hover effects in @media (hover: hover) for mobile safety

3. GSAP (only if animation level 7+ in DESIGN.md):
   - Dynamic import pattern -- do NOT load GSAP in the initial bundle:
     if (typeof window !== 'undefined') {
       const { gsap } = await import('gsap');
       const { ScrollTrigger } = await import('gsap/ScrollTrigger');
       gsap.registerPlugin(ScrollTrigger);
     }
   - Max 15 ScrollTrigger instances with scrub
   - Use scrub: 1 (smoothed) not scrub: true (raw) to reduce CPU pressure

4. PAGE TRANSITIONS:
   - ClientRouter already in Layout.astro
   - Add transition:name attributes to elements that should morph between pages
   - Fade transition as default, morph for shared elements (logo, nav)

5. REDUCED MOTION:
   - Every animation wrapped in @media (prefers-reduced-motion: no-preference) or the inverse
   - Under reduced motion: content visible immediately, no animation, scroll position preserved

6. PERFORMANCE CHECKS:
   - NEVER set opacity: 0 on hero heading, hero image, or any above-fold LCP candidate
   - Hero images: loading="eager" fetchpriority="high" (verify not removed during effects work)
   - Verify no layout shift from animations (transform + opacity only, never width/height/margin)
   - Mobile: disable parallax and horizontal scroll effects below 768px

Run npm run build -- zero errors.
```

---

### Prompt 6 -- Cross-Page Integration

```
All pages are built with effects. Now integrate everything.

1. NAVIGATION (Header.astro):
   - All main pages linked with correct trailing-slash URLs
   - Active page highlighting (compare Astro.url.pathname)
   - Mobile hamburger menu: accessible, closes on link click, closes on outside click
   - Sticky header with backdrop-blur on scroll (CSS only: position: sticky + backdrop-filter)
   - Phone number visible on desktop, tap-to-call on mobile

2. FOOTER (Footer.astro):
   - Navigation links to all main pages
   - Legal links: Privacy, Voorwaarden
   - Contact info: address, phone (tel: link), email (mailto: link)
   - Business details: KvK number, BTW-ID from CONTENT/contact.md
   - Certifications/badges if applicable
   - Copyright with current year (new Date().getFullYear())

3. INTERNAL LINKS:
   - Follow CONTENT/sitemap.md crosslink plan
   - Each service page links to 2 related services ("Ook interessant" section)
   - FAQ answers link to relevant service pages where applicable
   - Breadcrumbs on all subpages: Home > [Section] > [Page]
   - ALL links end with trailing slash -- no exceptions

4. FORMS (ContactForm.astro):
   - Fields from DESIGN.md section 9 (name, email, phone, message at minimum)
   - Client-side validation: required fields, email format, phone format
   - Cloudflare Turnstile placeholder div (actual key added during deployment)
   - Privacy consent checkbox with link to /privacy/
   - Submit button with loading state
   - Success/error message display

5. RESPONSIVE VERIFICATION at 375px, 768px, 1024px, 1280px:
   - Dutch compound words don't overflow containers (use overflow-wrap: break-word as fallback; hyphens: auto produces ugly breaks in practice — avoid it)
   - Navigation collapses to hamburger at appropriate breakpoint
   - Cards stack to single column on mobile
   - Images scale proportionally
   - Touch targets >= 44px on all interactive elements
   - Sticky mobile CTA bar at bottom (phone + primary CTA button) -- fixed on mobile only

6. Run npm run build -- zero errors.
```

---

### Prompt 7 -- Final Review

```
Run npm run dev. Check every page systematically.

CHECKLIST -- verify each item, fix immediately if failing:

Navigation & Links:
- [ ] Every page from CONTENT/sitemap.md exists and renders
- [ ] All internal links work (click every link, no 404s)
- [ ] All internal links end with trailing slash
- [ ] Breadcrumbs show correct hierarchy on subpages
- [ ] Active nav state highlights current page

Content:
- [ ] No placeholder text anywhere (search for "Lorem", "placeholder", "TODO", "TBD")
- [ ] All Dutch copy matches CONTENT/ files exactly
- [ ] Dutch formatting correct: euro sign (EUR X.XXX,XX or from X,-), comma decimals, date format (DD maand YYYY)
- [ ] Phone numbers formatted correctly and are tel: links
- [ ] Email addresses are mailto: links

Visual & Effects:

DESIGN QUALITY PIPELINE -- run first, fix issues before continuing the checklist:
With frontend-design skill active, run:
  /audit     -- flags anti-patterns, type issues, contrast problems, generic patterns
  /normalize -- checks cross-page visual consistency across all built pages
  /polish    -- pre-launch refinement suggestions

For any section flagged by /audit as needing structural improvement:
  Use magic__21st MCP `21st_magic_component_refiner` on that section's component code.
  Apply the targeted suggestions before editing manually.

After the pipeline passes, continue:
- [ ] Effects from BUILD-PLAN.md are implemented and visible
- [ ] Visual craft elements (SVG shapes, blobs, gradients) are present
- [ ] Section padding varies (not uniform py-* across the page)
- [ ] No two consecutive sections use identical card layouts
- [ ] Hero LCP not blocked by opacity: 0 (inspect element, check computed opacity)
- [ ] prefers-reduced-motion: animations disabled, content still visible

Responsive:
- [ ] Mobile (375px): single column, readable text, no horizontal scroll
- [ ] Tablet (768px): appropriate grid adjustments
- [ ] Desktop (1024px+): full layout as designed
- [ ] Sticky mobile CTA bar visible on mobile only
- [ ] Touch targets >= 44px

Performance:
- [ ] npm run build succeeds with zero errors
- [ ] Hero images: loading="eager" fetchpriority="high"
- [ ] Below-fold images: loading="lazy"
- [ ] No GSAP loaded if archetype is A or D (should be CSS-only)

When all checks pass:

git add -A
git commit -m "feat: complete Session 3 website build"
```

--> HUMAN: Click through every page. Test on mobile (use browser DevTools device mode). Compare against DESIGN.md mood and homepage-reference.html feel. If anything is off, describe the issue and Claude edits in place. Iterate until satisfied before moving to Session 4 (SEO).
