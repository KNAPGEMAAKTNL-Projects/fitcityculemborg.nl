# Fitcity Culemborg Project Guidelines

## Brand Name
Always write the brand name as **Fitcity Culemborg** (exact format). NOT [FitCity].

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
