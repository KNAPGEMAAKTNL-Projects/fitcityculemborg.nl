# Session 1 — Design Direction

> Single session. ~90 minutes. Output: `DESIGN.md` + `SITEMAP-DRAFT.md` + `homepage-reference.html` + inner page references (one per page type) + `REDIRECTS-SOURCE.md` (if existing site)
> Skills: `frontend-design` / Impeccable (activate for Prompts 3c, 4, 4b)
> MCPs: `coolors`, `google-fonts`, `hugeicons`, `mermaid`, `uiuxpro`, `playwright`

## Prerequisites

- Client info collected (business name, URL, niche, location, services, brand assets)
- Project folder created (empty directory, Claude Code opened inside it)

---

## Prompts

### Prompt 0 — Project Setup

```
Set up this project folder for a new website build. Do the following:

1. Run `git init` to initialize a git repository.

2. Copy the project template from the Hub:
   cp -r "C:/Users/yanni/Hub/business/templates/claude-project-template" ".claude"
   This gives us the full setup including agents, helpers, hooks, settings, rules
   (astro-conversion.md, design-fidelity.md), and skills.

3. Create `.mcp.json` with this exact content:
{
  "mcpServers": {
    "claude-flow": {
      "command": "cmd",
      "args": ["/c", "npx", "-y", "@claude-flow/cli@latest", "mcp", "start"],
      "env": {
        "npm_config_update_notifier": "false",
        "CLAUDE_FLOW_MODE": "v3",
        "CLAUDE_FLOW_HOOKS_ENABLED": "true",
        "CLAUDE_FLOW_TOPOLOGY": "hierarchical-mesh",
        "CLAUDE_FLOW_MAX_AGENTS": "15",
        "CLAUDE_FLOW_MEMORY_BACKEND": "hybrid"
      },
      "autoStart": true
    }
  }
}

4. Create `CLAUDE.md` with this content:

# [FitCity] Project Guidelines

## Brand Name
Always write the brand name as **[FitCity]** (exact format).

## Tech Stack
- Framework: Astro 5 (Static Site Generation)
- Styling: Tailwind CSS 4 (via @tailwindcss/vite, NOT @astrojs/tailwind)
- Deployment: Cloudflare Pages
- Animation: CSS-only (or GSAP if DESIGN.md specifies animation level 7+)

## Design System
Read `DESIGN.md` before making ANY visual decisions. It is the single source of truth.
Read `.claude/rules/astro-conversion.md` and `.claude/rules/design-fidelity.md` — these MUST be followed during builds.

## Design Reference
`homepage-reference.html` is the visual reference. `DESIGN.md` is the token source of truth.
During builds, reference both — homepage-reference.html for layout intent, DESIGN.md for exact values.

## Skills
Activate `frontend-design` for any HTML generation tasks (design previews, homepage reference, component prototyping).

## Critical Rules
- All internal links MUST end with trailing slash (Astro trailingSlash: "always")
- All text in Dutch unless specified otherwise
- Use je/jij (check DESIGN.md for exceptions)
- All formatting: Dutch conventions (comma decimals, period thousands, EUR before amount with space)
- Date format: "15 maart 2025" (day first, lowercase month)
- Phone format: 06-12345678 or local area code
- Postcode format: 1234 AB
- Never use stock photos for team/project imagery
- Never use "Versturen" as form button text
- Never use aggressive sales language ("Wij zijn de #1...")
- NEVER add max-w-*, mx-auto, or container wrappers not in the reference HTML
- NEVER normalize padding/margin values across sections
- NEVER symmetrize asymmetric layouts from the reference design

5. Create `.gitignore` with:
node_modules/
dist/
.astro/
.env
.env.*
.DS_Store

6. Stage all files and create an initial commit with message "chore: initial project setup"
```

**Replace `[Client Name]` and `[CLIENT BRAND NAME]` with the actual client details before running.**

---

### Prompt 1 — Business Discovery & Archetype

```
Read the business-type blueprints reference at C:\Users\yanni\Hub\business\sops\reference-business-type-blueprints.md.
Read the effects library at C:\Users\yanni\Hub\business\sops\reference-effects-library.md (just the intensity mapping table).
Read the conversion patterns at C:\Users\yanni\Hub\business\sops\reference-conversion-patterns.md (CTA architecture section).

We are starting a new website project. Here is the client information:

● - Business Name: FitCity Culemborg
  - Current Website URL: https://fitcityculemborg.nl 
  - Niche/Industry: Sportschool / Fitness & Gym
  - Location (City, Region): Culemborg, Gelderland 
  - Service Area: Culemborg en omgeving — Beusichem, Buren, Tricht, Buurmalsen     - Primary Service/Product: Fitnesstraining, Ladies Only zone, Kickboxinglessen
  - Brand assets available: Logo yes (public/images/fitcity-logov2.png), brand colors yes — Primary Yellow #FFE303, Dark BG #141414, Ladies Pink #FF2E93, Kickboxing Orange #FF5722; fonts: Oswald 700 (headings), Inter 400/600 (body) 
  - Photos available: Hero video (public/videos/fitcity-hero.mp4), kickboxing photos (public/images/kickboxen-1.webp t/m kickboxen-6.webp), members photo (public/images/fitcity-members.webp), equipment brand logos (Nautilus, SportsArt, Technogym)
  - Client's personality/vibe: No-nonsense, industrieel, energiek en direct — "Geen poespas. Gewoon een goede gym." Betaalbaar, resultaatgericht, authentiek

Based on this information and the blueprints reference:

1. Identify the business archetype (A through E) and look up the FULL blueprint.

2. Show me:
   - Archetype + visual tone scores (energy, density, formality, richness, animation)
   - Proposed homepage section order
   - Hero type recommendation
   - Trust signal priority ranking (top 3)
   - CTA architecture (primary + secondary contact method, form fields, button text — cross-reference with conversion patterns)
   - Pricing display approach (full/range/hidden)
   - Animation level and what effects are appropriate (from intensity mapping)
   - Common mistakes to avoid for this business type

3. If the client has an existing website:
   - Read it and note what works and what doesn't
   - Crawl the existing URL structure: list all indexed pages (use WebFetch on sitemap.xml, or crawl nav/footer links if no sitemap exists)
   - Save as REDIRECTS-SOURCE.md: a table of current URLs, page titles, and estimated importance (high/medium/low based on whether the page has meaningful content or search rankings)
   - This data is used in Session 4 for 301 redirect mapping to preserve search rankings
   - If the current URL structure is strong (clean slugs, logical hierarchy), note which paths to keep in the new build

4. Note: "Client HAS brand colors/fonts: [yes/no]" — this determines color/typography approach in Prompts 3a-3b.

5. SUB-VARIANT CHECK: Some business types need a B2B/B2C split. Ask me:

   For Schoonmaakbedrijven: "Is this primarily B2B (kantoren, bedrijven), B2C (particulieren, woningen), or mixed?"
   - B2B: bump formality to 6, CTA = "Offerte aanvragen", trust = client logos + case studies, typography = structured (Inter, Roboto)
   - B2C: keep formality at 3, CTA = "Bereken prijs" or "Bestel nu", trust = reviews + price transparency, typography = rounded friendly (Nunito, Quicksand)
   - Mixed: default to primary audience for hero, add secondary pathway as separate section

   For Schilders: "Is this primarily residential or commercial?"
   - Residential: warmer tone, before/after photos of homes, "je/jij", pricing per m2
   - Commercial: slightly more formal, project photos of offices/buildings, "u" optional, offerte-based

   For Bouwbedrijven/Aannemers: "Is this renovatie (consumers) or nieuwbouw (developers)?"
   - Renovatie: B2C approach, portfolio of home renovations, "je", price ranges
   - Nieuwbouw: B2B approach, project references, "u", offerte only

   For Installateurs: "Is this primarily consumers (cv-ketel) or businesses (klimaatsystemen)?"
   - Consumer: emergency CTA prominent, pricing visible, "je"
   - Business: offerte-focused, certifications prominent, "u" acceptable

   If none of these apply, skip this step.

6. INTERACTIVE PATTERN RECOMMENDATION: Based on the service count and archetype, recommend an interactive navigation pattern:

   - 3-5 services: Pattern C (card selector). Zero JS, clickable service cards on homepage. DEFAULT for all client sites.
   - 6-15 services with meaningful differentiation: Pattern C with category grouping, or 2-step guided quiz (Pattern A) if analytics show high homepage bounce rates.
   - 15+ services across multiple dimensions: Guided quiz (Pattern A) adds measurable value. Rare for lokale dienstverleners.
   - Price-sensitive niche (schilders, dakdekkers, verhuizers): Consider cost calculator (Pattern D) as premium upsell. Only viable at EUR 2,000+ project pricing or as productized component.

   For Schoonmaakbedrijven specifically:
   - B2B with 6+ diensten (kantoorschoonmaak, industrieel, gevelreiniging, etc.): Pattern C with service category grouping
   - B2C with standardized pricing: Pattern D (cost calculator) is a strong fit — "Bereken je schoonmaakkosten"
   - Mixed: Pattern C cards segmented by audience ("Zakelijk" / "Particulier")

Show me everything including the sub-variant answer and interactive pattern recommendation. I will confirm or adjust before we continue.
```

---

### Prompt 1b — Page Inventory

> **Skills:** none
> **MCPs:** `mermaid`

```
Read the following before starting:
- Prompt 1 output (archetype, blueprint, services list, sub-variant answer)
- REDIRECTS-SOURCE.md (if it exists — crawled existing URL structure from Prompt 1)
- C:\Users\yanni\Hub\business\sops\reference-business-type-blueprints.md (archetype default page list)

We are defining the complete page inventory for this site before any design work begins.
This drives:
1. Which inner page reference HTMLs get generated in Prompt 4b
2. Which page shells get scaffolded in Session 3 Prompt 2
3. The 301 redirect map for Session 4

STEP 1 — PAGE CONSTRAINTS:

Ask me: "Are there any services or pages from the existing site (or planned site) that
this client will NOT have? For example: services dropped, areas no longer served, or pages
to merge." Wait for my answer before proceeding.

STEP 2 — PAGE INVENTORY:

If the client has an existing site (REDIRECTS-SOURCE.md exists):
  For each URL in REDIRECTS-SOURCE.md, assign a status:
  - keep-exact: same slug, same purpose
  - keep-redirect: same purpose, slug changes → must 301 from old to new
  - merge: content moves into another page → 301 to that target page
  - drop: service/page no longer offered → 410 or 301 to homepage
  - new: no equivalent in old site

If no existing site:
  Use the archetype default page list from the blueprints reference as starting point.

Apply all constraints from Step 1.

STEP 3 — CATEGORIZE BY PAGE TYPE:

Assign every page to one of these types:
- homepage
- service (individual service/dienst page)
- service-category (overview of services — only if 6+ services)
- location (werkgebied/[stad] — one per city in service area)
- location-service ([stad]/[dienst] cross-page — ONLY for competitive local SEO markets with
  budget for 10+ pages)
- portfolio (project overview — archetype B only)
- portfolio-item (individual project — archetype B only)
- about
- contact
- faq
- blog-index (if blog in scope)
- blog-post (template only — if blog in scope)
- legal (privacy, voorwaarden — template only, no reference HTML needed)

STEP 4 — BUILD SITEMAP-DRAFT.md:

| # | Page (NL) | Type | URL | Old URL | Status | Priority |
|---|-----------|------|-----|---------|--------|----------|

Priority:
- P0 = must launch with site (homepage, core services, contact)
- P1 = launch within 2 weeks (FAQ, about, location pages)
- P2 = later (blog, location-service cross-pages)

After the table, add a "Page Types Requiring Reference HTML" section listing which unique
types from the inventory need a reference HTML generated in Prompt 4b. One entry per unique
type (not per individual page). Example:

- [ ] homepage (done in Prompt 4)
- [ ] service
- [ ] location (if any location pages exist)
- [ ] location-service (if any)
- [ ] portfolio (if archetype B)
- [ ] about + contact (combined)
- [ ] faq
- [ ] blog-post (if blog in scope)

Also add a "Redirect Map" section (existing sites only):

| Old URL | New URL | Status Code | Reason |
|---------|---------|-------------|--------|

STEP 5 — VISUAL SITEMAP:

Use the mermaid MCP to generate a sitemap diagram:
- Top level: homepage
- Second level: main sections (Diensten, Werkgebied, Blog, etc.)
- Third level: individual pages per section
- Show page type in brackets next to each node: [service], [location], etc.

Save the Mermaid diagram code in SITEMAP-DRAFT.md under "## Sitemap Diagram".

Save SITEMAP-DRAFT.md in the project root.
```

-> HUMAN: Review SITEMAP-DRAFT.md. Confirm or adjust: add pages, drop pages, change slugs,
adjust priorities. This is the last moment to change page structure before competitor research
and design begin. Approve before continuing to Prompt 2a.

---

### Prompt 2a — Competitor Research

```
Research 10 competitors for this business.

Research mix:
- 5 local competitors: search "[service] [city]" and "[service] [region]"
- 5 national leaders: search "beste [service] Nederland" or "[service] [major city]"

Create `COMPETITORS.md` in the project root with this table:

| # | Site | FULL URL | What stands out | Hero approach | Trust signals used | CTA approach | My rating |
|---|------|-----|-----------------|---------------|-------------------|-------------|-----------|
| 1 | | | | | | | /10 |
| ... | | | | | | | /10 |

Leave "My rating" empty — I will fill it in.

After the table, answer:
1. What is the "local baseline"?
2. What do the national leaders do differently?
3. What mistakes do the worst competitors make?

Save as COMPETITORS.md.
```

-> HUMAN: Open each competitor URL. Rate them 1-10 on design quality in COMPETITORS.md. Then continue with Prompt 2b.

---

### Prompt 2b — Analyze Top-Rated Competitors

```
Read COMPETITORS.md. Look at my ratings.

For the top 3 highest-rated competitors:
- Use WebFetch to fetch each site's full HTML
- Save the raw HTML to: competitor-reference/[site-name].html
- Analyze: section order, typography, colors, spacing, trust signals, CTA, animation, decorative elements
- SPECIFICALLY look for: full-bleed sections, asymmetric grids, overlapping elements, decorative SVG shapes, varying section padding

For the lowest-rated:
- What makes them look bad?

Summarize:
1. Top 3-5 design decisions to incorporate
2. CSS layout patterns that make the best ones look professional

Save analysis to COMPETITORS.md. HTML files in competitor-reference/ will be referenced during design generation.
```

---

### Prompt 3a — Color Options

```
Read the following before starting:
- Prompt 1 output (archetype, tone scores, brand asset status)
- COMPETITORS.md (top-rated competitors and their color approaches)
- competitor-reference/*.html (actual HTML from top competitors — extract color values)
- C:\Users\yanni\Hub\business\sops\reference-business-type-blueprints.md (archetype color psychology)

If the client has a logo file, use coolors MCP `extract_image_colors` to pull the dominant colors from it.

For each top-rated competitor in competitor-reference/*.html, extract their color palette (primary, secondary, accent, background, text colors).

Now generate a file called `color-options.html` with 3 palette options. Each palette must define: primary, secondary, accent, background, surface, and text colors.

OPTION A — Brand-Anchored:
- If client HAS brand colors: use those exactly as primary/secondary. Derive accent, background, surface, text to complement them. Use coolors MCP `harmonize_colors` to find complementary tones.
- If client has NO brand colors: derive from archetype color psychology in the blueprints. Use specific hex values that match the archetype mood (e.g., deep forest green for hoveniers, clinical blue for tandartsen). Use coolors MCP `generate_palette` seeded from the archetype's mood color.

OPTION B — Competitor-Inspired:
- Take the highest-rated competitor's palette as a starting point. Do NOT copy it — shift hues by 15-30 degrees, adjust saturation/lightness to create a distinct but equally professional palette. Use coolors MCP `harmonize_colors` on the shifted base.

OPTION C — Creative Contrast:
- Design a palette that stands out from ALL competitors in the market. Use archetype mood as the emotional anchor but pick unexpected color angles. If all competitors use blue, go warm. If all use neutrals, introduce a bold accent. Use coolors MCP `generate_palette` with the contrast concept.

For each palette option, use coolors MCP `check_contrast` to verify:
- Text on background: WCAG AA minimum (4.5:1)
- Large text on background: WCAG AA (3:1)
- Button text on button background: WCAG AA (4.5:1)

The HTML file must:
- Show each palette as visual swatches (large colored rectangles with hex values labeled below each)
- Show a mini section preview for each palette: a hero-like block with heading (in the heading color on the background), subtext (in the text color), and a CTA button (in the accent/primary on a contrasting background)
- Use actual hex values labeled clearly next to every swatch
- Be self-contained: inline CSS, no external dependencies except Google Fonts CDN if needed for preview text
- Include a title "Kleurpaletten — [Client Name]" at the top
- Show color role labels: Primair, Secundair, Accent, Achtergrond, Oppervlak, Tekst

Save as `color-options.html` in the project root.
```

-> HUMAN: Open `color-options.html` in browser. Pick favorite palette (or say "mix A primary with C accent" etc).

---

### Prompt 3b — Typography Options

```
Read the following before starting:
- Prompt 1 output (archetype, tone scores, formality level)
- COMPETITORS.md (what fonts the top competitors use)
- C:\Users\yanni\Hub\business\sops\reference-business-type-blueprints.md (archetype typography personality)

If the client has a brand font, that font is locked for headings. Use google-fonts MCP `list_pairings` to find 3 body font pairings for it.

If the client has NO brand font, use google-fonts MCP to find 3 complete heading + body pairings:
- Use `search_fonts` with the archetype personality keywords (e.g., "geometric modern" for archetype A, "organic rounded" for archetype B hoveniers, "clean clinical" for archetype D)
- Use `list_pairings` for each candidate heading font to get recommended body pairings
- Each pairing should have a different character: one classic/safe, one modern/distinctive, one expressive/bold

Generate a file called `typography-options.html` with 3 font pairing options.

For each option show:
- Font names and weights clearly labeled (e.g., "Space Grotesk 700 + Inter 400/600")
- Google Fonts category (sans-serif, serif, display)
- A hero headline in Dutch: 5-7 words, realistic for the business type (e.g., "Uw tuin, ons meesterwerk" or "24/7 loodgieterservice in Utrecht")
- A subtext line: 15-25 words in Dutch, realistic service description
- A body paragraph: 3-4 sentences of realistic Dutch service business text (NOT lorem ipsum)
- A CTA button: "Vraag gratis offerte aan"
- Nav links row: Home | Diensten | Over ons | Portfolio | Contact
- A Dutch compound word stress test: show "schoonmaakdiensten", "tuinonderhoud", "verwarmingsinstallatie", "kantoorschoonmaak" at heading size to check if the font handles long Dutch words without awkward breaks

For each option, show at TWO widths side by side (or stacked):
- Desktop: 1440px max-width preview
- Mobile: 375px max-width preview

Include character budget info per option:
- Characters per line at H1 size (desktop)
- Characters per line at body size (desktop)
- Whether the font has Dutch-specific glyphs (ij ligature, accented vowels)

Load all fonts via Google Fonts CDN `<link>` tags.
The HTML must be self-contained: inline CSS, no external dependencies beyond Google Fonts CDN.
Include a title "Typografie — [Client Name]" at the top.

Save as `typography-options.html` in the project root.

ICON SYSTEM DECISION:
Based on the chosen typography personality, recommend an icon set. Show 5-6 sample icons (home, phone, arrow-right, check, menu, star) from each option:
- Option 1: Lucide (clean, geometric — pairs with modern sans-serif)
- Option 2: Phosphor (friendly, rounded — pairs with rounded/humanist fonts)
- Option 3: Tabler Icons (balanced, professional — pairs with neutral fonts)

Add the icon samples as inline SVGs at the bottom of typography-options.html, grouped by option, so the human can see how icons + fonts feel together.

Note the chosen icon set — it will be documented in DESIGN.md and used across all pages.
```

-> HUMAN: Open `typography-options.html` in browser. Pick favorite font pairing AND icon set.

---

### Prompt 3c — Layout, Hero & Effects

> **Skills:** `frontend-design` / Impeccable
> **MCPs:** `magic__21st`, `magicui`, `uiuxpro`

```
Read the following before starting:
- Prompt 1 output (archetype, tone scores, section order, hero recommendation)
- COMPETITORS.md (top-rated design patterns, layout analysis)
- competitor-reference/*.html (actual HTML from top competitors)
- C:\Users\yanni\Hub\business\sops\reference-business-type-blueprints.md (archetype constraints)
- C:\Users\yanni\Hub\business\sops\reference-effects-library.md (intensity mapping for this archetype)
- C:\Users\yanni\Hub\business\sops\reference-visual-craft-library.md (decorative elements selection guide)
- The chosen color palette from Prompt 3a (whichever option the human picked)
- The chosen typography from Prompt 3b (whichever pairing the human picked)

PART 0 — MODERN COMPONENT INSPIRATION:
Before making any layout or effects decisions, scan what is currently achievable in modern
component libraries. This prevents defaulting to known patterns when better options exist.

1. Use magic__21st MCP `21st_magic_component_inspiration` for each of these section types
   that are in this archetype's homepage blueprint:
   - "hero section [archetype energy level: low/medium/high]"
   - "service cards" or "service selector"
   - "testimonials" or "social proof section"
   - "stats counter section" (if in blueprint)
   - "process steps" or "how it works section"
   Note: request in English, translate inspiration back to Dutch context.

2. Use magicui MCP `searchRegistryItems` for animation patterns matching the archetype
   animation level (from effects library intensity mapping):
   - Level 1-3: search "subtle", "fade", "reveal"
   - Level 4-6: search "scroll", "counter", "stagger"
   - Level 7+: search "spotlight", "beam", "morphing", "parallax"
   Note which components are available — they expand the effects palette in Part C.

3. Use uiuxpro MCP `search_patterns` with "[archetype] landing page layout" and
   "[primary service type] website" to find industry-specific layout approaches.

After running these, note:
- Any patterns from magic/magicui that are more distinctive than the competitor approaches
- Any animated components from magicui that match the animation level and could replace
  custom CSS effects
- Any layout patterns from uiuxpro not represented in the L1-L4, C1-C7, V1-V4 menu below

These findings expand the option menu — add discovered patterns as additional choices
alongside the standard options in Parts A-C.

PART A — LAYOUT SUGGESTIONS:
Pick 3-5 layout suggestions from this menu based on archetype + what the top competitors do well:

LAYOUT:
- L1: Asymmetric hero (60/40 or 70/30 split)
- L2: Asymmetric grid in services/content section (not equal columns)
- L3: Full-bleed section (edge-to-edge, breaking the container)
- L4: Overlapping elements (image overlapping section boundary)

CONTENT PRESENTATION:
- C1: Services as editorial layout instead of card grid
- C2: Horizontal scroll element (for portfolio, logos, or testimonials)
- C3: Process/werkwijze as timeline instead of numbered steps
- C4: FAQ accordion (always recommended — AI SEO critical)
- C5: Before-after comparison slider (recommended for archetype B visual trades — hoveniers, schilders, schoonmaak. Uses img-comparison-slider web component, 7.5 kB, zero framework overhead)
- C6: Service selector cards (clickable card grid linking to service pages — zero JS, pure HTML/CSS. DEFAULT for all sites with 3+ services. JSON-configurable: title, icon, description, href per card. Use accessible pseudo-element stretch pattern for full-card clickability)
- C7: Cost calculator (PREMIUM UPSELL only — for price-sensitive niches: schilders, dakdekkers, verhuizers, schoonmaak B2C. Preact + client:visible, ~3 KB. Pair with static pricing table above for SEO. Show ranges not exact prices to mitigate ACM risk. Only recommend at EUR 2,000+ project pricing)

VISUAL ELEMENTS:
- V1: Non-straight section divider (wave, diagonal, curved)
- V2: Background texture or pattern in one section
- V3: Dark background section for contrast
- V4: Scale contrast (oversized numbers + small labels)

Also check: what did the top-rated competitors from Prompt 2b do that we liked? Add those patterns as suggestions too.

PART B — HERO TYPE:
Recommend a hero type based on archetype + what competitors do:
- Split (60/40), Full-Bleed Image, Typography Hero, CTA-First, Booking Hero, Before/After

PART C — EFFECTS:
From the effects library intensity mapping, list effects appropriate for this animation level.
Categorize as: scroll-triggered, hover, page-load, continuous.
Note the performance budget from the effects library.

PART D — GENERATE LAYOUT OPTIONS HTML:
Using the `frontend-design` skill, generate `layout-options.html` showing 2-3 hero/layout approaches.

Each option must:
- Apply the chosen color palette and typography from Prompts 3a-3b
- Show a full hero section (with heading, subtext, CTA button, image placeholder area)
- Show one content section below the hero (services, stats, or werkwijze — whichever best demonstrates the layout approach)
- Use the layout suggestions from Part A applied differently in each option
- Draw inspiration from competitor-reference HTML patterns (professional spacing, grid structures)
- Reference specific visual craft library elements by name (e.g., "Gentle Wave divider between hero and services", "Blur Blob behind hero image")

The HTML must be self-contained: inline CSS + Google Fonts CDN only.
Include a title "Layout Opties — [Client Name]" at the top.
Label each option clearly: "Optie 1: [description]", "Optie 2: [description]", etc.

Save as `layout-options.html` in the project root.

Show me: layout suggestions + hero recommendation + effects list + the generated HTML file.
```

-> HUMAN: Open `layout-options.html` in browser. Pick favorite layout approach. Confirm or adjust the effects list.

---

### Prompt 4 — Full Homepage Reference

> **Skills:** `frontend-design` / Impeccable
> **MCPs:** `magic__21st`

```
Read the following before starting:
- Prompt 1 output (archetype, full blueprint: section order, hero, CTA, trust signals, pricing display)
- COMPETITORS.md (design patterns analysis)
- competitor-reference/*.html (actual HTML — use for layout inspiration, NOT to copy)
- C:\Users\yanni\Hub\business\sops\reference-visual-craft-library.md (FULL file — decorative elements with code)
- C:\Users\yanni\Hub\business\sops\reference-effects-library.md (FULL file — for effect descriptions, NOT for implementation code yet)
- The chosen color palette from Prompt 3a
- The chosen typography from Prompt 3b
- The chosen layout approach from Prompt 3c (hero type, layout suggestions, effects list)

SECTION-LEVEL INSPIRATION RESEARCH:
Before generating, run targeted inspiration scans for the sections that will define
the visual character of this site. Focus on the hero and the 2-3 most prominent sections.

For each key section from the blueprint section order, call magic__21st MCP
`21st_magic_component_builder` with a description matching this client:
- Hero: "hero section for [archetype type] business, [energy level], [color palette mood]"
- Services/main content: "service cards for [business type], [layout style from 3c]"
- If the blueprint includes a stats/numbers section: "stats counter for [business type]"
- CTA section: "call-to-action section for local Dutch service business"

Use the results as a "what's possible" reference. Do NOT copy them — translate the
strongest patterns into the chosen palette, typography, and Dutch context. The goal is
to push beyond the default, not to import foreign design language wholesale.

Using the `frontend-design` skill, generate a complete single-page HTML homepage.

SECTIONS — follow the archetype blueprint section order from Prompt 1. For EACH section, include:
- Real placeholder Dutch text (realistic for this business type — NOT lorem ipsum)
- The appropriate layout pattern from the chosen approach
- Visual craft elements from reference-visual-craft-library.md (reference them by name)
- Colors and typography exactly as chosen in Prompts 3a-3b

DESIGN CRAFT RULES — follow ALL of these:

1. SECTION PADDING MUST VARY: hero pt-32 pb-20, stats py-12, services py-24, process pt-20 pb-28, reviews py-24, about pt-16 pb-24, contact py-24, footer pt-16 pb-8. Do NOT use uniform padding.

2. SECTION BACKGROUNDS MUST VARY: alternate between light (background color), white (surface color), dark (primary-900 or similar), accent-tinted (primary at 5% opacity), image backgrounds. At least one dark section. At least one accent-tinted section.

3. LAYOUT MUST NOT BE UNIFORM:
   - Do NOT center everything in a narrow container
   - Do NOT make all cards the same size
   - Do NOT use only rectangles with no decorative shapes
   - DO use asymmetric grids where the archetype calls for it (7/5, 8/4, 3/3/6)
   - DO let at least one element break the container edge (full-bleed or offset)
   - DO vary card sizes within a grid (e.g., one large + two small, or editorial mixed layout)

4. DECORATIVE ELEMENTS — pick 3-5 from the visual craft library and apply them:
   - Name each one in an HTML comment where it's used (e.g., <!-- Visual Craft: Gentle Wave Divider -->)
   - Replace color values with the chosen palette colors
   - Place them at section transitions, behind hero images, or as accent details

5. TYPOGRAPHY HIERARCHY — use the chosen fonts with clear hierarchy:
   - H1: hero only, largest size (48-72px depending on archetype energy)
   - H2: section headings, clearly smaller than H1
   - H3: card/item headings
   - Body: readable at 16-18px
   - Small: labels, captions, meta text
   - All in Dutch. All realistic for the business type.

6. CTA ARCHITECTURE — from Prompt 1:
   - Primary CTA button style consistent across the page (color, shape, size)
   - Secondary CTA as ghost/outline button
   - Sticky mobile CTA bar at bottom (fixed position)
   - Form section with the recommended field count and button text

7. TRUST SIGNALS — from Prompt 1 priority ranking:
   - Place top trust signals in/near the hero
   - Distribute remaining trust signals in appropriate sections
   - Use realistic Dutch trust content (review scores, certification names, "jaar ervaring" numbers)

8. RESPONSIVE — design mobile-first:
   - Mobile: 375px (primary design target — 60-80% of traffic for local service businesses)
   - Tablet: 768px (grid expansion)
   - Desktop: 1440px (full layout with whitespace)
   Write CSS mobile-first: base styles for 375px, then scale up with min-width media queries. Touch targets >= 44px on all interactive elements.

9. SELF-CONTAINED — the HTML file must work when opened directly in a browser:
   - Inline all CSS in a <style> tag (or use Tailwind CDN play script if the layout is complex)
   - Load fonts via Google Fonts CDN <link> tags
   - Use placeholder image URLs (e.g., via picsum.photos or colored divs with labels like "[Team foto]")
   - No external JS dependencies

10. ANTI-GENERIC CHECKLIST — before saving, verify:
    [ ] No two adjacent sections have the same background color
    [ ] Section padding values are NOT all the same
    [ ] At least one grid uses asymmetric column spans
    [ ] At least one decorative SVG or shape element exists
    [ ] At least one section breaks the standard container width
    [ ] Cards within a section are NOT all identical in size/layout
    [ ] The hero has at least 3 visual layers (text, image/shape, decorative element)
    [ ] Every visual choice traces to a reference source (archetype, competitor, craft library)

NOTE: Navigation links in header/footer are PLACEHOLDERS — the final sitemap is defined in Session 2. Use sensible defaults (Home | Diensten | Over ons | Portfolio | Contact) and mark with an HTML comment: <!-- NAV: placeholder — finalize after Session 2 sitemap -->

Save as `homepage-reference.html` in the project root.

After generating, list:
- Which visual craft library elements were used and where
- Which competitor patterns inspired each section
- Which archetype blueprint decisions drove the section order and CTA placement
```

-> HUMAN: Open `homepage-reference.html` in browser. Review the full page. If changes are needed,
describe what feels off (e.g., "darker footer", "hero needs more contrast", "services section
should use editorial layout not cards", "more whitespace between sections 3 and 4").

For section-level improvements, ask Claude to run magic__21st `21st_magic_component_refiner`
on that specific section before editing — it provides targeted suggestions for what to improve
and how, rather than rewriting from scratch.

Claude edits the existing HTML file — no full regeneration. Iterate until satisfied.

---

### Prompt 4b — Inner Page References

> **Skills:** `frontend-design` / Impeccable (active for all generation, `/audit`, `/normalize`)
> **MCPs:** `hugeicons`, `uiuxpro`

```
Read the following before starting:
- SITEMAP-DRAFT.md — specifically the "Page Types Requiring Reference HTML" section.
  Generate ONE reference HTML per listed type. Do not generate for types not in that list.
- homepage-reference.html (approved homepage — style anchor for ALL reference files)
- DESIGN.md tokens (palette, typography, components) — if Prompt 5 was already done.
  Otherwise use chosen palette, typography, and layout from Prompts 3a-3c.
- C:\Users\yanni\Hub\business\sops\reference-visual-craft-library.md

BEFORE generating each reference file:
1. Use uiuxpro MCP `search_patterns` to find layout patterns for this page type
   (e.g., "service page layout", "location landing page", "FAQ accordion page").
   Use 1-2 findings to inform layout decisions.
2. Use uiuxpro MCP `search_components` for page types needing specific components
   (e.g., accordion, contact form, portfolio masonry grid).

Using the `frontend-design` skill, generate reference HTML files for each type listed in
SITEMAP-DRAFT.md "Page Types Requiring Reference HTML":

--- HOMEPAGE ---
Already done in Prompt 4. Skip.

--- SERVICE PAGE → service-page-reference.html ---
- Page hero: smaller than homepage hero, H1 = service name + breadcrumb
- Direct answer paragraph (40-60 words)
- Service description section (text + image placeholder, asymmetric layout)
- "Waarom kiezen voor..." (3-4 benefit cards or bullet points)
- Process/werkwijze (3-5 steps)
- Service-specific FAQ accordion (3-5 questions)
- CTA section with form or contact prompt
- Related services ("Ook interessant") — 2-3 cards

--- LOCATION PAGE → location-page-reference.html ---
(Generate only if SITEMAP-DRAFT.md lists location pages)
- Page hero: H1 = "[Dienst] in [Stad]", subtext with service area context
- Local trust signals: proximity note, local project references
- Services overview for this location (same ServiceSelector layout as homepage)
- Local FAQ: "Zijn jullie actief in [buurt]?", "Hoe snel kunnen jullie in [stad] komen?"
- CTA section
- Note: location pages lead with LOCAL signals, not service details

--- LOCATION-SERVICE PAGE → location-service-reference.html ---
(Generate only if SITEMAP-DRAFT.md lists location-service cross-pages)
- H1: "[Dienst] [Stad]" — highly targeted keyword page
- Very compact: direct answer (60 words), trust signals, CTA
- Do NOT repeat full service description — link prominently to main service page
- Short local FAQ (2-3 questions only)

--- PORTFOLIO PAGE → portfolio-reference.html ---
(Generate only if SITEMAP-DRAFT.md lists portfolio type — archetype B only)
- Project grid: editorial or masonry layout (NOT uniform card grid)
- Filter bar by service type (CSS-only, no JS)
- Individual project card: hero image, project name, location, services used

--- FAQ PAGE → faq-page-reference.html ---
- H1: "Veelgestelde vragen" or a warmer variant
- Category jump links (anchor links to FAQ sections by topic)
- Accordion using semantic <details>/<summary> — zero JS
  Use hugeicons MCP `get_icon_glyph_by_style` to find a chevron/expand icon
  matching the typography personality chosen in Prompt 3b. Include as inline SVG.
- CTA at bottom: "Staat je vraag er niet bij?"

--- ABOUT + CONTACT → about-contact-reference.html ---
ABOUT: founder/team layout, photo placeholder, credentials/certifications, values section
CONTACT: split layout — form left, business details right, map placeholder area

--- BLOG POST → blog-post-reference.html ---
(Generate only if SITEMAP-DRAFT.md lists blog-post type)
- Article hero: H1, publish date, reading time, author
- Article body: realistic Dutch long-form typography
  (H2/H3 hierarchy, max 70ch width, blockquote, list, inline link styling)
- Related posts (3 cards at bottom)
- CTA: contact or newsletter prompt
- Breadcrumb: Home > Blog > [Title]

ALL reference files must be:
- Self-contained: inline CSS + Google Fonts CDN only
- Mobile-first responsive (375px base, scaling up)
- Consistent with homepage-reference.html visual language
- Labeled: "Referentie: [Page Type] — [Client Name]" at top

AFTER generating each file, immediately run `/audit [filename]` to verify the design passes
quality checks before moving to the next file.

AFTER all files are generated, run:
/normalize homepage-reference [all generated reference files]
to verify cross-page visual consistency.
```

-> HUMAN: Open each reference HTML in browser. The types listed in SITEMAP-DRAFT.md determine
exactly which files exist — nothing more, nothing less. Request layout adjustments if needed.
These don't need to be pixel-perfect — they set the direction for Session 3 builders.

---

### Prompt 5 — Extract Design System (DESIGN.md)

```
Read the following:
- homepage-reference.html (the approved visual reference)
- Prompt 1 output (archetype, tone scores, CTA architecture, trust signals, pricing display)
- Prompt 3c output (effects list, layout suggestions)
- C:\Users\yanni\Hub\business\sops\reference-effects-library.md (for effect code references)

Analyze homepage-reference.html and extract ALL design tokens into DESIGN.md.

DESIGN.md must contain these sections in this order:

## 1. Project Identity
- Client name, business type, archetype letter + name
- Visual tone scores (energy, density, formality, richness, animation)
- Brand assets (logo, colors, fonts — what the client provided vs what we chose)
- Addressal: je/jij or u/uw (with justification from sub-variant check)
- Target audience summary (from Prompt 1)

## 2. Color System
Extract from homepage-reference.html every color used. Document as:
- Role (primary, secondary, accent, background, surface, surface-elevated, text, text-muted, border, error, success)
- Hex value
- Where used (e.g., "hero background, footer background, dark section bg")
- WCAG contrast ratio against its most common pairing

## 3. Typography
Extract from homepage-reference.html:
- Heading font: family, weights used, Google Fonts import URL
- Body font: family, weights used, Google Fonts import URL
- Type scale: H1 through H6 sizes (px and rem), line-heights, letter-spacing
- Body text size, line-height
- Small/caption text size
- Font loading strategy recommendation (display: swap)

## 4. Spacing System
Extract from homepage-reference.html:
- Section padding values (list each section with its exact pt/pb/py)
- Container max-widths used
- Grid gaps
- Component internal padding (cards, buttons, form fields)
- Vertical rhythm between elements within sections

## 5. Component Styles
Extract from homepage-reference.html:
- Button styles: primary (bg, text, border-radius, padding, hover state), secondary/ghost, sizes
- Card styles: background, border-radius, shadow, padding, hover state
- Form field styles: border, border-radius, padding, focus state, label positioning
- Badge/pill styles
- Nav link styles (normal, hover, active)
- Any other recurring component patterns

## 6. Grid & Layout
Extract from homepage-reference.html:
- Grid column structures per section (e.g., "hero: 7/5 split", "services: 4/4/4 with first card spanning 8")
- Breakpoint behavior (what changes at 1024px, 768px, 640px)
- Container strategy (max-width values, when full-bleed is used)
- Which sections break the container

## 7. Decorative Elements
List every visual craft element used in homepage-reference.html:
- Element name (from visual craft library)
- Where placed
- Color values used
- SVG code or CSS snippet (so builders can reproduce exactly)

## 8. Icon System
- Chosen icon set (from Prompt 3b): name, CDN/import method
- Icon sizes: default (24px), small (16px), large (32px)
- Icon style: outline weight, corner radius matching typography

## 9. Design Suggestions
The layout suggestions chosen in Prompt 3c (L1-L4, C1-C4, V1-V4 selections).
Include the specific competitor patterns we decided to incorporate.
These guide Claude Code during the build phase.

## 10. Animation Specification
- Animation level (from archetype)
- Approved effects list (from Prompt 3c Part C)
- Performance budget (from effects library)
- Which effects apply to which sections
- Reduced-motion fallback requirement

## 11. CTA Architecture
- Primary contact method + button text
- Secondary contact method + button text
- Form fields (count, names, types, placeholder text)
- Sticky mobile CTA bar: yes/no, content
- CTA placement per section
- Multi-step form structure if applicable (from conversion patterns)

## 12. Trust Signals
- Priority ranking (top 3 from Prompt 1)
- Placement per section
- Specific content (review score, certification names, experience years, guarantee text)

## 13. Pricing Display
- Approach: full/range/hidden (from archetype)
- Format: Dutch conventions (EUR X,- or vanaf EUR X)
- Where displayed (which sections)
- BTW note requirement

## 14. Anti-Patterns (NEVER DO)
- Do not add max-w-*, mx-auto, or container wrappers not in the reference HTML
- Do not normalize padding/margin values across sections
- Do not symmetrize asymmetric layouts
- Do not use only fade-in-up animation
- Do not use stock photography for team/project images
- Do not use "Versturen" as form button text
- Do not use aggressive sales language
- Do not use countdown timers or fake urgency
- Do not use visible CAPTCHA
- Do not mix je/u on the same site
- Do not set hero elements to opacity: 0 (GSAP-managed elements must have opacity: 1 by default)

## 15. Dutch UX Requirements
- Number format: 1.234,56
- Currency: EUR 49,- or EUR 49,95 (EUR + space + amount)
- Date: "15 maart 2025"
- Phone: 06-12345678 or area code format
- Postcode: 1234 AB
- Cookie banner: NOT required if using cookie-free architecture (Cloudflare Web Analytics + static map image + build-time reviews + Turnstile). Only add cookie consent (CookieConsent by Orestbida) if client requires GA4, YouTube embeds, or interactive Google Maps iframe
- Legal footer: KVK-nummer, BTW-nummer
- Hyphens: do NOT use `hyphens: auto` — it produces ugly breaks in Dutch. Use `overflow-wrap: break-word` as a safety net instead. Set `lang="nl"` on `<html>` for proper locale behavior.
- Trailing slashes: ALL internal links end with `/`

## 16. Design Reference
- `homepage-reference.html` is the visual reference for homepage layout, spacing, and visual intent
- `service-page-reference.html`, `blog-post-reference.html`, `about-contact-reference.html` are visual references for inner pages
- `DESIGN.md` is the token source of truth for exact values
- During builds: when in doubt about layout, reference the HTML files. When in doubt about a value, reference DESIGN.md.
- `competitor-reference/*.html` files show professional patterns to maintain quality parity

Save as `DESIGN.md` in the project root.

Then commit everything:
git add DESIGN.md homepage-reference.html service-page-reference.html blog-post-reference.html about-contact-reference.html color-options.html typography-options.html layout-options.html COMPETITORS.md REDIRECTS-SOURCE.md competitor-reference/
git commit -m "design: complete Session 1 design direction"
```

-> HUMAN: Review DESIGN.md. Confirm or request changes. Once approved, Session 1 is complete. Proceed to Session 2 (Content & Copywriting).
