# BUILD-PLAN.md
# [FitCity] Culemborg — Session 3 Build Plan
# Generated: 4 april 2026

---

## Project Summary

| Key | Value |
|---|---|
| **Archetype** | E — Lifestyle & Personal Brand (sub-type #13: PT / Sportscholen) |
| **Animation level** | 6/10 — CSS-only (0 KB JS budget for decoration) |
| **GSAP** | Not used (threshold: 7+) |
| **Framework** | Astro 5 + Tailwind CSS 4 (`@tailwindcss/vite`) |
| **Deployment** | Cloudflare Pages |
| **Total JS budget** | ~2.5 KB (pricing toggle ~1.5 KB + IO scroll fallback ~0.5 KB + header scroll ~0.5 KB) |

---

## Layout Patterns

### Pattern 1: Hero Split Grid
- **Source:** `homepage-reference.html` lines 178–241
- **Grid:** `grid-template-columns: 1fr 1fr` — content placed in `grid-column: 2` (right side)
- **Mobile:** Collapses to `1fr`, content moves to `grid-column: 1`, center-aligned
- **Breakpoint:** `768px`
- **Why it fits:** TrainMore-inspired — massive hero with bold typography on dark background, content positioned asymmetrically. High energy (9/10) demands a hero that dominates the viewport.

### Pattern 2: Asymmetric Services Grid
- **Source:** `homepage-reference.html` lines 533–564
- **Grid:** Desktop: `grid-template-columns: 1fr 1fr`, `grid-template-rows: auto auto`. Fitness card spans `grid-row: 1 / 3; grid-column: 1` (tall left), Ladies Only + Kickboxing stack right
- **Mobile:** `1fr` single column
- **Breakpoint:** `768px`
- **Why it fits:** Avoids identical-card-grid trap. Visual hierarchy signals "fitness is our core" while giving Ladies Only and Kickboxing clear but secondary positions. Matches DESIGN.md section 6 exactly.

### Pattern 3: 7fr/5fr Content Split
- **Source:** `homepage-reference.html` lines 688–695
- **Grid:** `grid-template-columns: 7fr 5fr` with `3rem` gap
- **Mobile:** `1fr`, image below text
- **Breakpoint:** `768px`
- **Why it fits:** Text-heavy "De Vibe" section needs space for ~70 words + checklist. The asymmetric split avoids 50/50 monotony and gives content room to breathe. Used across inner pages for description sections.

---

## Effects Selection

**Archetype E intensity mapping, filtered to 3+ rating AND CSS-only (per 0 KB JS budget):**

| Effect | E Score | Section(s) | Implementation | CSS-only? |
|---|---|---|---|---|
| Scroll fade-up | 4 | Content sections, cards, inner pages | `animation-timeline: view()` + IO fallback (~0.5 KB) | Yes |
| Stagger reveal | 4 | Service cards, kickboxing gallery, pricing cards | CSS `animation-delay: calc(var(--i) * 100ms)` | Yes |
| Card lift hover | 4 | Service cards, pricing cards | `translateY(-4px)` + `box-shadow` on `transition: all 250ms cubic-bezier(0.4,0,0.2,1)` | Yes |
| Image overlay hover | 4 | Kickboxing gallery items | `opacity` transition on `:hover` overlay | Yes |
| View transitions | 4 | All page navigation (fade) | `<ClientRouter />` (browser-native, 0 KB) | Yes |
| Marquee | 4 | Equipment brands strip | `@keyframes marquee` 20s linear infinite + fade mask | Yes |
| Scale reveal | 3 | Hero content on page load | CSS `@keyframes scale-reveal` from `scale(0.97)` | Yes |
| Color transitions | 3 | Pricing toggle active/inactive state change | CSS `transition: background 0.2s, color 0.2s` | Yes |

**Additional micro-effects (always approved, no intensity threshold):**

| Effect | Section | Implementation |
|---|---|---|
| CTA hover | All primary buttons | `opacity: 0.9` on hover, `transition: opacity 0.2s` |
| Ghost button hover | Secondary CTAs | `border-color` transition to higher opacity |
| Bounce | Hero scroll indicator | `@keyframes bounce` vertical translateY, `2s infinite` |
| FAQ icon rotate | FAQ accordion | `transform: rotate(45deg)` on `[open]`, `transition: 0.2s` |
| Header bg transition | Sticky header on scroll | `transition: background 0.3s ease, box-shadow 0.3s ease` |

**Excluded despite 3+ score (reason):**

| Effect | Score | Exclusion reason |
|---|---|---|
| Background parallax | 4 | CSS-only parallax is limited; full effect needs GSAP. Not worth complexity. |
| Offset parallax | 3 | Requires GSAP ScrollTrigger |
| Image zoom on scroll | 3 | Adds complexity for marginal visual gain on this dark-bg site |
| SplitText | 3 | GSAP plugin, ~5 KB additional |
| Clip-path reveals | 3 | Complex implementation, doesn't match "geen poespas" brand voice |
| Floating elements | 3 | Too playful/decorative for a no-nonsense gym |
| Pulsing CTA | 3 | DESIGN.md specifies simpler opacity hover; pulsing feels aggressive |
| Gradient mesh | 4 | Hero blur blob already provides ambient glow; adding mesh would over-decorate |
| Skeleton shimmer | 3 | Static site — no loading states needed |

**Performance budget:**

| Category | Size | Notes |
|---|---|---|
| CSS scroll reveals | 0 KB | Compositor-only (opacity + transform) |
| IO fallback script | ~0.5 KB | Firefox only, once per page |
| Pricing toggle | ~1.5 KB | Vanilla JS, data-attribute switching |
| Header scroll detection | ~0.5 KB | IntersectionObserver or scroll event |
| **Total JS** | **~2.5 KB** | Well under 10 KB threshold |

**Reduced motion:** All animations wrapped in `@media (prefers-reduced-motion: no-preference)`. Default state is always visible (zero CLS).

---

## Visual Craft Elements

**Selected from visual craft library, confirmed against DESIGN.md section 7:**

### 1. CSS Blur Blob (★★★ for E)
- **Code reference:** Visual craft library §1.2 "CSS Blur Blob"
- **Section:** Hero — behind text content
- **Values:** `300px` circle (400px at 768px+), `background: #FFE303`, `opacity: 0.04`, `filter: blur(100px)`, centered via `translate(-50%, -50%)`
- **Purpose:** Subtle ambient glow that adds depth without overwhelming dark background

### 2. Gentle Wave Divider (★★ for E)
- **Code reference:** Visual craft library §1.1 "Gentle Wave"
- **Section:** Hero → Equipment strip transition
- **Values:** SVG path `d="M0,0 C360,60 1080,60 1440,0 L1440,60 L0,60 Z"`, `fill: #0e0e0e` (next section bg), `preserveAspectRatio="none"`, `viewBox="0 0 1440 60"`
- **Purpose:** Organic transition between hero and dark equipment strip, replaces hard edge

### 3. SVG Grain Texture (★★ for E)
- **Code reference:** Visual craft library §2 "Grain/Noise Overlay"
- **Section:** Vibe "De Vibe" section background
- **Values:** `<feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="4" stitchTiles="stitch"/>`, `opacity: 0.25`, `pointer-events: none`
- **Purpose:** Adds texture that prevents flat-panel look. Subtle enough to not interfere with text readability.

### 4. CSS Marquee + Fade Mask (universal utility)
- **Code reference:** Effects library §5 "CSS Marquee"
- **Section:** Equipment brands strip
- **Values:** `@keyframes marquee { 0% { transform: translateX(0) } 100% { transform: translateX(-50%) } }`, `20s linear infinite`. Mask: `mask-image: linear-gradient(90deg, transparent, black 15%, black 85%, transparent)`
- **Purpose:** Infinite scroll of brand logos (Nautilus, SportsArt, Technogym) — communicates equipment quality without a static list

### 5. CSS Dot Grid (★ for E, but matches DESIGN.md spec)
- **Code reference:** Visual craft library §1.3 "CSS Dot Grid"
- **Section:** Contact CTA section (yellow full-bleed)
- **Values:** `::before` with `radial-gradient(circle, rgba(20,20,20,0.08) 1px, transparent 1px)`, `background-size: 24px 24px`
- **Purpose:** Subtle texture on solid yellow CTA section, prevents flat-block look

**Not adding additional craft elements.** DESIGN.md already specifies 7 decorative elements (blur blob, wave divider, grain, marquee, dot grid, heading underline, reviews border accent). The archetype E recipe suggests "ambient blob mesh + gradient underline + frosted glass card + S-curve flourish + asymmetric corners" but those lean too luxe/organic for a gym. The existing set matches the "Gewoon een goede gym" brand.

---

## Component Choices

### MCP Research Summary

**shadcn themes reviewed:** 42 themes. "bold-tech" was closest (dark + bold accent), but no shadcn components will be used, so no theme applied. Custom CSS properties from DESIGN.md section 16 serve as the design system.

**shadcn components reviewed:** 56 components. Relevant candidates: `accordion` (FAQ), `tabs` (pricing toggle), `sheet` (mobile menu), `navigation-menu` (header). All rejected — each requires React runtime (~45 KB baseline). Framework-agnostic alternatives exist for every use case.

**Magic UI components reviewed:** 70 components. Cross-referenced with effects list:
- `marquee` — matches our equipment strip, but CSS @keyframes achieves the same effect at 0 KB vs React island
- `number-ticker` — could animate review count (4.6, 28 reviews), but static display is more appropriate for a gym site
- `shimmer-button` / `interactive-hover-button` — nice but require React, our CSS hover is sufficient
- `text-animate` — 9 animation variants, but GSAP-level complexity for what we achieve with CSS fade-up

**21st.dev inspiration reviewed:**
- "PulseFitHero" (0.671 similarity) — fitness-specific hero with social proof and program cards carousel. Uses framer-motion (React). Confirmed: our reference hero design is already superior for this specific gym context.
- "Pricing" (1.389 similarity) — toggle between monthly/yearly with BorderTrail animation. Uses React + framer-motion. Pattern: frequency toggle + card grid. Our vanilla JS pricing toggle achieves the same UX.
- "Service Card" (0.339 similarity) — carousel with color-coded gradient cards. Uses embla-carousel (React). Our CSS grid with color-coded top borders is more performant.

### Final Component Decisions

| Component | Source Library | `client:load`? | JS Cost | Rationale |
|---|---|---|---|---|
| **FAQ Accordion** | Framework-agnostic (`<details>/<summary>`) | No | 0 KB | DESIGN.md specifies this exact implementation. Zero JS, full accessibility. |
| **Contact Form** | Native HTML elements | No | 0 KB | `<form>`, `<input>`, `<select>`, `<textarea>`. Cloudflare Turnstile added as invisible `<script>` (~15 KB, unavoidable). |
| **Header/Nav** | Custom `.astro` component | No* | ~0.5 KB | Vanilla JS for: (1) scroll state detection, (2) hamburger toggle. *Script in `<script>` tag, not island. |
| **Mobile Menu** | Custom `.astro` component | No | 0 KB | CSS class toggle via hamburger button. Slide-in overlay. |
| **Pricing Toggle** | Custom `.astro` component | No* | ~1.5 KB | Vanilla JS: reads `data-plan` attribute, shows/hides pricing rows. 3 states: Jaar/Halfjaar/Flex. |
| **Equipment Marquee** | CSS `@keyframes` | No | 0 KB | Duplicated content for seamless loop + `mask-image` fade. |
| **Service Cards** | HTML + Tailwind | No | 0 KB | Static markup, CSS hover transition. |
| **Pricing Cards** | HTML + Tailwind | No | 0 KB | 3 cards per toggle state, CSS transitions on state change. |
| **Google Reviews Strip** | HTML + Tailwind | No | 0 KB | Static build-time data (4.6 rating, 28 reviews). |
| **Mobile Sticky CTA** | HTML + Tailwind | No | 0 KB | Fixed bottom bar, hidden at 768px+. WhatsApp SVG icon + yellow CTA. |
| **Scroll Reveal** | CSS + IO fallback | No* | ~0.5 KB | `animation-timeline: view()` with IntersectionObserver fallback for Firefox. |

**Total: 0 React islands. ~2.5 KB vanilla JS. No `client:load` directives needed.**

### shadcn Theme Baseline
Not applicable — no React components used. If React components are added later (e.g., for a booking system), use `bold-tech` theme as the closest starting point, then override with DESIGN.md CSS custom properties.

---

## Interactive Patterns

**Standard navigation sufficient — no interactive selector needed.**

Session 1 did not recommend Pattern A (guided quiz), C (card selector), or D (cost calculator). The pricing toggle (Jaar/Halfjaar/Flex) is the only interactive element beyond standard navigation.

### Pricing Toggle Specification

**Interaction model:** 3-tab pill toggle (Jaar / Halfjaar / Flex)
**Default state:** "Jaar" active (best value)
**Data structure:**

```typescript
interface PricingPlan {
  name: string;           // "Smart Deal", "Ladies Only Jaar", etc.
  slug: string;           // "smart-deal" (for aria/id attributes)
  price: string;          // "€24,50"
  period: string;         // "/maand"
  duration: string;       // "12 maanden"
  features: string[];     // ["Onbeperkt fitness", ...]
  badge?: string;         // "Beste Deal" or undefined
  accent: 'primary' | 'secondary' | 'default';  // Card accent color
  cta: string;            // "KIES SMART DEAL"
  href: string;           // "/signup/"
}

interface PricingToggleData {
  jaar: PricingPlan[];
  halfjaar: PricingPlan[];
  flex: PricingPlan[];
}
```

**Implementation:** All pricing HTML rendered server-side in 3 containers. Vanilla JS toggles `display: none/grid` via `data-plan` attribute on parent. CSS transitions for smooth state changes. Active tab styled with `#FFE303` background per DESIGN.md section 5.

---

## Anti-Patterns

### From DESIGN.md Section 14

- NEVER add `max-w-*`, `mx-auto`, or container wrappers not in the reference HTML
- NEVER normalize padding/margin values across sections — they MUST vary per section (see DESIGN.md Section 4)
- NEVER symmetrize asymmetric layouts from the reference design (services grid, kickboxing gallery, vibe grid)
- NEVER use only fade-in-up animation — vary the motion types
- NEVER use stock photography for team/project imagery
- NEVER use "Versturen" or "Verzenden" as form button text
- NEVER use aggressive sales language ("Wij zijn de #1...")
- NEVER use countdown timers or fake urgency
- NEVER use visible CAPTCHA — use Cloudflare Turnstile + honeypot
- NEVER mix je/u addressing on the same site
- NEVER set hero elements to `opacity: 0` (all elements visible by default, CSS animations handle reveal)
- NEVER use `hyphens: auto` — use `overflow-wrap: break-word` instead
- NEVER use border-radius `0` where the reference uses `0.5rem` (cards, gallery items, vibe image)
- NEVER add border-radius to primary/ghost buttons (they are sharp-cornered in the reference)
- NEVER change the `250ms cubic-bezier(0.4, 0, 0.2, 1)` easing on card hover — it is intentional

### Additional Build Anti-Patterns

- **No `opacity: 0` on hero elements** — LCP trap. Hero content must be visible by default. Scale-reveal animation enhances visibility, does not create it.
- **No uniform `py-*` on 3+ consecutive sections** — Section padding MUST vary. Refer to DESIGN.md Section 4 spacing table for exact values per section.
- **No centered-everything layout** — Hero content is right-aligned (grid-column: 2). Vibe section is 7/5 split. Only pricing heading and CTA sections are centered. Edge tension is intentional.
- **No identical card components across sections** — Service cards have top-border accents + "Meer info" links. Pricing cards have price/period/features/CTA. FAQ items are details/summary. Each is structurally different.

### From Build Rules (`.claude/rules/`)

**astro-conversion.md:**
- Conversion is mechanical translation, NOT creative interpretation
- Only add responsive breakpoint classes as ADDITIONS, never replacing existing classes
- Run CSS class diff check after every conversion

**design-fidelity.md:**
- Asymmetric grid splits (7/5, services grid) are deliberate
- Varying section heights create intentional rhythm
- Full-bleed sections are a pattern, not an error
- When something looks wrong, check source HTML first, then ask user

---

## File Structure (Target)

```
src/
  components/
    Header.astro
    Footer.astro
    MobileCTA.astro
    ScrollReveal.astro
    EquipmentMarquee.astro
    ServiceCard.astro
    PricingToggle.astro
    PricingCard.astro
    FaqItem.astro
    ReviewStrip.astro
    SectionHeading.astro
    ContactForm.astro
    HeroSection.astro
    VibeSection.astro
    KickboxingGallery.astro
    ContactCTA.astro
  layouts/
    Layout.astro
    InnerLayout.astro
  pages/
    index.astro
    fitness/index.astro
    ladies-only/index.astro
    kickboxing/index.astro
    over-ons/index.astro
    contact/index.astro
    faq/index.astro
    privacy/index.astro
    voorwaarden/index.astro
  styles/
    global.css
    effects.css
  data/
    pricing.ts
    hours.ts
    reviews.ts
    navigation.ts
public/
  images/
    (placeholder images)
  fitcity-logov2.webp
```

---

## Build Order

1. **Scaffold:** Astro 5 + Tailwind CSS 4 project setup
2. **Global styles:** CSS custom properties, @theme, effects.css
3. **Layout:** Layout.astro with head, font loading, ClientRouter
4. **Shared components:** Header, Footer, MobileCTA
5. **Homepage sections:** Build in order from DESIGN.md (hero → equipment → services → vibe → pricing → gallery → reviews → FAQ → CTA)
6. **Inner pages:** fitness, ladies-only, kickboxing, over-ons, contact, faq
7. **Legal pages:** privacy, voorwaarden
8. **Polish:** Scroll reveals, hover states, responsive testing
9. **QA:** Playwright screenshot comparison, Lighthouse audit
