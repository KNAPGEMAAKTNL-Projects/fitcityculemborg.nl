# [FitCity] Design System

> Single source of truth for all visual decisions during the Astro build phase.
> Last updated: 4 april 2026

---

## 1. Project Identity

- **Client:** [FitCity] Culemborg
- **Business type:** Sportschool / Fitness & Gym
- **Archetype:** E -- Lifestyle & Personal Brand (sub-type #13: Personal Trainers / Sportscholen)
- **Visual tone scores:**
  - Energy: 9/10
  - Density: 6/10
  - Formality: 3/10
  - Richness: 7/10
  - Animation: 6/10 (CSS-only, below GSAP threshold of 7)
- **Brand assets provided by client:**
  - Logo: `fitcity-logov2.png` / `fitcity-logov2.webp`
  - Colors: Primary Yellow #FFE303, Dark BG #141414, Ladies Pink #FF2E93 (kickboxing orange #FF5722 was TBD, currently using primary yellow)
  - Fonts: Oswald 700 (headings), Inter 400/600 (body)
- **Addressal:** je/jij -- informal throughout, no "u" exceptions. Brand vibe is "Geen poespas. Gewoon een goede gym." -- direct, no-nonsense
- **Target audience:** Local residents of Culemborg and surrounding cities (Beusichem, Buren, Tricht, Buurmalsen) looking for affordable, no-frills fitness. Includes women (Ladies Only zone) and kickboxing enthusiasts. Age range: 18-45 primary, skews younger.

---

## 2. Color System

Extracted from CSS custom properties in `homepage-reference.html`:

| Role | Hex | CSS Variable | Used In | WCAG Contrast |
|---|---|---|---|---|
| Primary | `#FFE303` | `--color-primary` | CTAs, headings accent, star ratings, badges | 14.25:1 on #141414 (AAA) |
| Secondary | `#FF2E93` | `--color-secondary` | Ladies Only accent, secondary cards | 5.32:1 on #141414 (AA) |
| Background | `#141414` | `--color-bg` | Main page bg, hero, most sections | -- |
| Surface | `#1C1C1C` | `--color-surface` | Cards, form fields, elevated surfaces | -- |
| Surface-alt | `#181818` | `--color-surface-alt` | Alternating section bg (vibe, reviews) | -- |
| Surface-dark | `#0e0e0e` | -- | Equipment strip, kickboxing gallery, footer bg | -- |
| Text | `#FFFFFF` | `--color-text` | Headings, primary text | 18.42:1 on #141414 (AAA) |
| Text-muted | `#999999` | `--color-text-muted` | Labels, captions, meta text | -- |
| Text-body | `#CCCCCC` | `--color-text-body` | Body paragraphs, descriptions | 13.96:1 on #141414 (AAA) |
| Border | `#2A2A2A` | `--color-border` | Card borders, dividers, form borders | -- |
| Separator | `#666666` | -- | Review pill separator, secondary labels, footer tagline | -- |

---

## 3. Typography

- **Heading font:** Oswald, weight 700, `text-transform: uppercase`
  - Google Fonts: `https://fonts.googleapis.com/css2?family=Oswald:wght@700&display=swap`
- **Body font:** Inter, weights 400 (regular) and 600 (semibold)
  - Google Fonts: `https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap`

**Type scale** (extracted from `homepage-reference.html`):

| Level | Size | Line-height | Letter-spacing | Used For |
|---|---|---|---|---|
| H1 | `clamp(3rem, 8vw, 5.5rem)` | 1.0 | -- | Hero headline only |
| H2 | `clamp(1.5rem, 4vw, 2rem)` | 1.1 | -- | Section headings |
| H3 | `1.25rem`--`1.5rem` | 1.2 | -- | Card headings |
| Eyebrow | `0.75rem` | -- | `0.2em` | Section labels, breadcrumbs |
| Body | `1rem`--`1.1rem` | 1.6--1.7 | -- | Body paragraphs |
| Small | `0.8rem`--`0.875rem` | 1.4 | -- | Captions, meta, form labels |
| Nav links | `0.8rem` | -- | `0.08em` | Header navigation |
| Button text | `0.9rem` | -- | `0.05em` | CTA buttons |

**Font loading:** `display=swap` in Google Fonts URL. Preconnect to `fonts.googleapis.com` and `fonts.gstatic.com`.

---

## 4. Spacing System

**Section padding** (extracted from `homepage-reference.html` -- these MUST vary):

| Section | Mobile | Desktop |
|---|---|---|
| Hero | `0` (100svh fills) | `0` |
| Equipment strip | `1.25rem 0` | `1.25rem 0` |
| Services "Ons Aanbod" | `3rem 0` | `6rem 0` |
| Vibe "De Vibe" | `3rem 0` | `5rem 0` |
| Pricing | `3rem 0` | `6rem 0` |
| Kickboxing Gallery | `3rem 0` | `5rem 0` |
| Google Reviews | `3rem 0` | `4rem 0` |
| FAQ | `3rem 0` | `5rem 0` |
| Contact CTA | `3rem 0` | `5rem 0` |
| Footer | `3rem 0 1.5rem` | `4rem 0 2rem` |

**Container max-widths:**
- Default content: `1200px`
- Narrow (FAQ, contact CTA): `800px`
- Full-bleed: hero, equipment strip, contact CTA, footer -- no max-width

**Grid gaps:** `1.5rem` (mobile), `2rem` (desktop)
**Card padding:** `1.5rem` (mobile), `2rem`--`2.5rem` (desktop)
**Button padding:** `1rem 2.5rem`
**Form field padding:** `0.875rem 1rem`

---

## 5. Component Styles

### Primary button (`.btn-primary`)

- Background: `#FFE303`
- Color: `#141414`
- Font: Oswald 700, `0.9rem`, uppercase, `letter-spacing: 0.05em`
- Padding: `1rem 2.5rem`
- Border: none
- Border-radius: `0`
- Min-height: `44px` (touch target)
- Hover: `opacity: 0.9`
- Transition: `opacity 0.2s`

### Ghost button (`.btn-ghost`)

- Background: `transparent`
- Color: `#FFFFFF`
- Font: same as primary
- Padding: `1rem 2.5rem`
- Border: `2px solid rgba(255,255,255,0.3)`
- Border-radius: `0`
- Min-height: `44px`
- Hover: `border-color: rgba(255,255,255,0.6)`
- Transition: `border-color 0.2s`

### Ghost button yellow (`.btn-ghost-yellow`)

- Background: `transparent`
- Color: `#FFE303`
- Font: Oswald 700, `0.85rem`, uppercase, `letter-spacing: 0.05em`
- Padding: `0.875rem 2rem`
- Border: `2px solid #FFE303`
- Min-height: `44px`
- Hover: `background: rgba(255,227,3,0.08)`

### Ladies variant button

- Same as primary but `background: #FF2E93`, `color: #FFFFFF` (note: ladies CTA uses white text, not dark)

### Dark button (`.btn-dark`) -- Contact CTA section

- Background: `#141414`
- Color: `#FFE303`
- Padding: `1rem 2.5rem`
- Min-height: `44px`

### Outline dark button (`.btn-outline-dark`) -- Contact CTA section

- Background: `transparent`
- Color: `#141414`
- Border: `2px solid #141414`
- Hover: `background: rgba(20,20,20,0.08)`

### Card (`.service-card`, `.pricing-card`)

- Background: `#1C1C1C` (`var(--color-surface)`)
- Border: `1px solid #2A2A2A`
- Border-radius: `0.5rem`
- Padding: `1.5rem` (mobile), `2rem`--`2.5rem` (desktop)
- Top accent border: `3px solid [accent color]` (service cards)
- Hover: `transform: translateY(-4px)`, `box-shadow: 0 8px 32px rgba(0,0,0,0.3)`
- Transition: `all 250ms cubic-bezier(0.4, 0, 0.2, 1)`

### Glass pill (`.hero-reviews`)

- Background: `rgba(255,255,255,0.05)`
- Backdrop-filter: `blur(8px)`
- Padding: `0.625rem 1.25rem`
- Border-radius: `9999px`
- Star size: `20px`, fill `#FFE303`

### Form fields

- Background: `#1C1C1C`
- Border: `1px solid #2A2A2A`
- Padding: `0.875rem 1rem`
- Color: `white`
- Font: Inter 400, `1rem`
- Focus: `border-color: #FFE303`

### Badge ("Beste Deal")

- Background: `#FFE303`
- Color: `#141414`
- Font: Oswald 700, `0.7rem`, uppercase, `letter-spacing: 0.05em`
- Padding: `0.3rem 0.75rem`
- Border-radius: `0.25rem`
- Position: absolute `top: 1rem; right: 1rem` of card

### Pricing toggle

- Container: `background: rgba(255,255,255,0.03)`, `backdrop-filter: blur(4px)`, `border: 1px solid #2A2A2A`, `border-radius: 9999px`, `padding: 4px`
- Active tab: `background: #FFE303`, `color: #141414`, font-weight 600
- Inactive tab: `background: transparent`, `color: #999`
- Tab button: Inter 600, `0.85rem`, `padding: 0.5rem 1.5rem`, `border-radius: 9999px`, `min-height: 44px`

### FAQ accordion

- Element: `<details>/<summary>`, zero JS
- Summary: Inter 600, `1rem`, white, `padding: 1.25rem 0`, `cursor: pointer`, `min-height: 44px`
- Border-bottom: `1px solid #2A2A2A`
- Icon: `+` via `.faq-icon` span, rotates 45deg on `[open]` via `transform: rotate(45deg)`, transition `0.2s`
- Answer: Inter 400, `0.9rem`, `#999`, `line-height: 1.6`, `padding-bottom: 1.25rem`
- Marker: hidden via `summary::-webkit-details-marker, summary::marker { display: none; content: '' }`

### Section heading (`.section-heading`)

- Font: Oswald 700, `2rem`, uppercase
- Color: `#FFFFFF`
- Underline: `::after` pseudo-element -- `60px` wide, `3px` tall, `background: #FFE303`, `margin-top: 0.75rem`

### Header

- Height: `72px`
- Padding: `0 1.5rem` (mobile), `0 2.5rem` (tablet), `0 3rem` (desktop)
- Position: `fixed`, `z-index: 100`
- Scrolled state: `background: rgba(20,20,20,0.9)`, `backdrop-filter: blur(12px)`, `box-shadow: 0 1px 0 rgba(255,255,255,0.05)`
- Transition: `background 0.3s ease, box-shadow 0.3s ease`
- Logo: Oswald 700, `1.5rem`, `color: #FFE303`, uppercase, `letter-spacing: 0.02em`
- Nav links: Inter 600, `0.8rem`, uppercase, `letter-spacing: 0.08em`, `color: #999` -> `#FFF` on hover
- Header CTA: Oswald 700, `0.8rem`, `padding: 0.6rem 1.5rem`, `background: #FFE303`, `color: #141414`
- Hamburger: 3 lines, `24px` wide, `2px` thick, white. Visible below 1024px.

### Mobile sticky CTA bar

- Position: `fixed`, `bottom: 0`, `z-index: 50`
- Background: `#141414`, `border-top: 1px solid #2A2A2A`
- Padding: `0.75rem 1rem`, `padding-bottom: calc(0.75rem + env(safe-area-inset-bottom, 0px))`
- WhatsApp icon: `44x44px` touch target, `color: #25D366`, SVG `28x28px`
- CTA button: flex 1, Oswald 700, `0.85rem`, uppercase, `background: #FFE303`, `color: #141414`, `min-height: 44px`
- Hidden at `768px+`

---

## 6. Grid & Layout

| Section | Desktop Grid | Mobile | Notes |
|---|---|---|---|
| Hero | `grid-template-columns: 1fr 1fr` | `1fr` | Content in right column (grid-column: 2), center-aligned |
| Services | 2-col: card 1 (`--fitness`) spans 2 rows, cards 2-3 stack | `1fr` | Asymmetric -- `grid-row: 1 / 3; grid-column: 1` on fitness card |
| Vibe | `7fr 5fr` | `1fr` | Text heavy left, image right. Gap: `3rem` desktop, `2.5rem` mobile |
| Pricing | `repeat(3, 1fr)` | `1fr` | 3 pricing cards, centered text above |
| Kickboxing gallery | `repeat(3, 1fr)` + first item spans `grid-row: 1 / 3` | `1fr 1fr` (first item spans full width) | Asymmetric |
| Google Reviews | `flex-direction: row`, `justify-content: center` | `flex-direction: column`, `align-items: center` | Logo + stars + count + CTA |
| Contact CTA | Centered content, `max-width: 800px` | Centered | Full-bleed yellow background |
| Footer | `2fr 1fr 1fr 1fr` | `1fr` | Brand (wide), nav, hours, contact |

**Breakpoints:** `768px` (tablet), `1024px` (desktop). Mobile-first approach.

**Full-bleed sections:** Hero, equipment strip, contact CTA, footer, Google Reviews.

---

## 7. Decorative Elements

| Element | Location | Implementation |
|---|---|---|
| CSS Blur Blob | Behind hero text | `300px` circle (`400px` at 768px+), `#FFE303`, `opacity: 0.04`, `filter: blur(100px)`, centered via `top: 50%; left: 50%; transform: translate(-50%, -50%)` |
| Gentle Wave Divider | Hero -> equipment strip transition | SVG `<path d="M0,0 C360,60 1080,60 1440,0 L1440,60 L0,60 Z">`, `fill: #0e0e0e` (next section bg), `preserveAspectRatio="none"`, `viewBox="0 0 1440 60"`, `margin-top: -1px` |
| SVG Grain Texture | Vibe section bg | `<feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="4" stitchTiles="stitch"/>`, `opacity: 0.25`, filter ID `grain-vibe`, `position: absolute; inset: 0; pointer-events: none` |
| CSS Marquee + Fade Mask | Equipment brands strip | `@keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }` -- `20s linear infinite`. Mask: `mask-image: linear-gradient(90deg, transparent, black 15%, black 85%, transparent)` |
| CSS Dot Grid | Contact CTA section | `::before` with `radial-gradient(circle, rgba(20,20,20,0.08) 1px, transparent 1px)`, `background-size: 24px 24px`, `position: absolute; inset: 0; pointer-events: none` |
| Section heading underline | All `<h2>` section headings | `::after` pseudo-element, `width: 60px`, `height: 3px`, `background: #FFE303` |
| Reviews border accent | Google Reviews strip | `border-top: 1px solid rgba(255,227,3,0.15)`, `border-bottom: 1px solid rgba(255,227,3,0.15)` |

---

## 8. Icon System

- **Set:** Lucide Icons
- **Import:** Via inline SVG (tree-shakeable, no CDN dependency)
- **Sizes:** `16px` (small/inline), `20px` (checklist, feature lists), `24px` (default, FAQ icon), `28px` (hero scroll, WhatsApp)
- **Style:** Stroke-based, `stroke-width: 2` (or `2.5` for checkmarks), `stroke-linecap: round`, `stroke-linejoin: round`
- **Color:** `currentColor` (inherits from parent text color)
- **Star icons:** Filled SVG path (not stroke), `fill: #FFE303`. Partial star uses `<linearGradient>` with hard stop at 60%.

---

## 9. Design Suggestions

**Layout patterns chosen (from Prompt 3c):**
- L3: Full-bleed sections (hero, equipment strip, contact CTA)
- C2: Horizontal scroll marquee (equipment brands)
- C6: Service selector cards (3 color-coded cards)
- C4: FAQ accordion (CSS-only `details/summary`)
- V3: Dark background section contrast (alternating `#141414` / `#181818` / `#0e0e0e`)
- V4: Scale contrast (oversized pricing numbers `3rem`, stat numbers)

**Competitor patterns incorporated:**
- **TrainMore:** Dark theme + accent color, massive section spacing, partner logo marquee, brush-marker accent style
- **SportCity:** Full-screen video hero, membership cards with "Meestgekozen" badge, review count social proof
- **Basic-Fit:** Alternating image/text blocks, ambassador/testimonial carousel pattern, multiple CTAs per page
- **Existing FitCity reference:** Glass pill Google Reviews in hero, pricing toggle (Jaar/Halfjaar/Flex), VibeSection copy

---

## 10. Animation Specification

- **Level:** 6/10 -> CSS-only (0 KB JS budget for decoration)
- **GSAP:** Not used. Only justified at animation level 7+.

**Approved effects:**

| Effect | Intensity | Sections | Implementation |
|---|---|---|---|
| Scroll fade-up | 4/5 | Content sections, cards | `animation-timeline: view()` + IntersectionObserver fallback (~0.5 KB) |
| Stagger reveal | 4/5 | Service cards, kickboxing gallery | CSS `animation-delay: calc(var(--i) * 100ms)` |
| Card lift hover | 4/5 | Service cards, pricing cards | `translateY(-4px)` + `box-shadow: 0 8px 32px rgba(0,0,0,0.3)` on `transition: all 250ms cubic-bezier(0.4,0,0.2,1)` |
| Image overlay hover | 4/5 | Kickboxing gallery | Opacity transition on `:hover` |
| CTA hover | Custom | Primary buttons | `opacity: 0.9` on hover, `transition: opacity 0.2s` |
| Ghost button hover | Custom | Ghost buttons | `border-color` transition to higher opacity white, `0.2s` |
| CSS marquee | 4/5 | Equipment brands strip | `@keyframes marquee` -- `20s linear infinite` translateX |
| Bounce | -- | Hero scroll indicator | `@keyframes bounce` -- vertical translateY, `2s infinite` |
| FAQ icon rotate | -- | FAQ accordion | `transform: rotate(45deg)` on `[open]`, `transition: transform 0.2s` |
| Header bg transition | -- | Sticky header on scroll | `transition: background 0.3s ease, box-shadow 0.3s ease` |

**Performance budget:** 0 KB JavaScript for decorative effects. All motion via CSS.

**Reduced motion:** All animations wrapped in `@media (prefers-reduced-motion: no-preference)`.

---

## 11. CTA Architecture

- **Primary CTA:** "WORD NU LID" -- `background: #FFE303`, `color: #141414`, links to `/signup/`
- **Secondary CTA:** "BEKIJK PRIJZEN" -- ghost button, links to `#pricing`
- **Mobile sticky bar:** Yes -- fixed bottom (below 768px), WhatsApp icon (green `#25D366`) + "WORD NU LID" yellow button. `safe-area-inset-bottom` padding for iPhone.
- **Form fields** (contact page): Naam (text), E-mail (email), Onderwerp (select), Bericht (textarea). Button text: "STUUR BERICHT" (NEVER "Versturen").
- **Microcopy:** "Binnen 24 uur reactie" below form button.

**CTA placements per section:**

| Section | CTA Present | Type |
|---|---|---|
| Header | Yes | "WORD LID" small button (Oswald 700, `0.8rem`, hidden on mobile) |
| Hero | Yes | Primary "WORD NU LID" + ghost "BEKIJK PRIJZEN" |
| Services | Per card | "Meer info ->" text links (Inter 600, `0.875rem`, accent color) |
| Pricing | Per card | "KIES [PLAN]" primary buttons (full-width, `0.85rem`) |
| Kickboxing gallery | Yes | Ghost yellow "BEKIJK KICKBOXING PRIJZEN" |
| Google Reviews | No | -- |
| FAQ | No | -- |
| Contact CTA | Yes | Dark "WORD NU LID" + outline-dark "PLAN PROEFTRAINING" |
| Footer | No | Contact info only |
| Mobile sticky | Yes | WhatsApp + "WORD NU LID" |

---

## 12. Trust Signals

**Priority ranking:**
1. **Google Reviews** -- 4.6 rating, 28 reviews. Glass pill in hero + full branded strip section with large `3rem` rating number.
2. **Equipment brands** -- Nautilus, SportsArt, Technogym logos/names. Marquee strip below hero on `#0e0e0e` background.
3. **NL Actief / FITNED** -- Dutch fitness registration. Footer badge.

**Secondary:** Member count ("120+ actieve leden"), opening hours reliability, Ladies Only dedicated zone, "Gratis begeleiding bij elk bezoek" in vibe checklist.

---

## 13. Pricing Display

- **Approach:** FULL / TRANSPARENT -- mandatory (USP is "de goedkoopste sportschool")
- **Format:** `EUR 24,50` displayed as `€24,50` (Dutch convention: comma decimal, euro sign directly before amount)
- **Term suffix:** `/maand` in `--color-text-muted`
- **Display location:** Dedicated pricing section on homepage + service pages
- **Toggle:** Jaar / Halfjaar / Flex duration switch (pill toggle, Inter 600)
- **Highlighted plan:** "Beste Deal" badge on recommended tier (absolute positioned, Oswald 700, `0.7rem`)
- **BTW note:** Not required for B2C consumer pricing
- **Pricing data:**

| Plan | Price | Duration | Notes |
|---|---|---|---|
| Smart Deal | `€24,50`/maand | 12 maanden | Onbeperkt fitness |
| Ladies Only Jaar | `€20,50`/maand | 12 maanden | Ladies Only zone + algemene fitness |
| Ultimate Fit Deal | `€37,50`/maand | 12 maanden | Includes kickboxing |
| Dagpas | `€7,00` | Eenmalig | -- |
| Proefles | Gratis | -- | -- |
| Inschrijfgeld | `€17,00` | Eenmalig | Shown as muted text below price: `€17,00 inschrijfkosten` |

- **Price amount styling:** Oswald 700, `3rem`, `line-height: 1`, accent color (primary yellow or secondary pink for ladies)

---

## 14. Anti-Patterns (NEVER DO)

- NEVER add `max-w-*`, `mx-auto`, or container wrappers not in the reference HTML
- NEVER normalize padding/margin values across sections -- they MUST vary per section (see Section 4)
- NEVER symmetrize asymmetric layouts from the reference design (services grid, kickboxing gallery, vibe grid)
- NEVER use only fade-in-up animation -- vary the motion types
- NEVER use stock photography for team/project imagery
- NEVER use "Versturen" or "Verzenden" as form button text
- NEVER use aggressive sales language ("Wij zijn de #1...")
- NEVER use countdown timers or fake urgency
- NEVER use visible CAPTCHA -- use Cloudflare Turnstile + honeypot
- NEVER mix je/u addressing on the same site
- NEVER set hero elements to `opacity: 0` (all elements visible by default, CSS animations handle reveal)
- NEVER use `hyphens: auto` -- use `overflow-wrap: break-word` instead
- NEVER use border-radius `0` where the reference uses `0.5rem` (cards, gallery items, vibe image)
- NEVER add border-radius to primary/ghost buttons (they are sharp-cornered in the reference)
- NEVER change the `250ms cubic-bezier(0.4, 0, 0.2, 1)` easing on card hover -- it is intentional

---

## 15. Dutch UX Requirements

- **Number format:** `1.234,56` (period thousands, comma decimal)
- **Currency:** `€24,50` or `vanaf €20,50` (euro sign directly before amount, no space)
- **Date format:** "15 maart 2025" (day first, lowercase month name)
- **Phone format:** `0345-123456` or `06-12345678`
- **Postcode format:** `4101 CM`
- **Cookie banner:** NOT required -- cookie-free architecture (Cloudflare Web Analytics + static map image + build-time reviews + Turnstile). Only add cookie consent (CookieConsent by Orestbida) if client requires GA4, YouTube embeds, or interactive Google Maps iframe.
- **Legal footer:** KVK-nummer, BTW-nummer (placeholders for now)
- **Hyphens:** Do NOT use `hyphens: auto` -- it produces ugly breaks in Dutch. Use `overflow-wrap: break-word` as a safety net instead. Set `lang="nl"` on `<html>`.
- **Trailing slashes:** ALL internal links end with `/` (Astro `trailingSlash: "always"`)
- **Addressal:** je/jij throughout. No exceptions.
- **Scroll behavior:** `scroll-behavior: smooth` on `<html>`, `scroll-padding-top: 80px` for sticky header offset.

---

## 16. Design Reference

- `homepage-reference.html` is the visual reference. `DESIGN.md` is the token source of truth.
- During builds, reference both -- `homepage-reference.html` for layout intent, `DESIGN.md` for exact values.
- Inner page references: `service-page-reference.html`, `location-page-reference.html`, `faq-page-reference.html`, `about-contact-reference.html`
- `competitor-reference/*.html` files show professional patterns to maintain quality parity (Basic-Fit, TrainMore, SportCity)

### CSS Custom Properties Block (copy into global styles)

```css
:root {
  --color-primary: #FFE303;
  --color-secondary: #FF2E93;
  --color-bg: #141414;
  --color-surface: #1C1C1C;
  --color-surface-alt: #181818;
  --color-text: #FFFFFF;
  --color-text-muted: #999999;
  --color-text-body: #CCCCCC;
  --color-border: #2A2A2A;
  --font-heading: 'Oswald', sans-serif;
  --font-body: 'Inter', sans-serif;
}
```

### Font Import (place in `<head>`)

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Oswald:wght@700&display=swap" rel="stylesheet">
```
