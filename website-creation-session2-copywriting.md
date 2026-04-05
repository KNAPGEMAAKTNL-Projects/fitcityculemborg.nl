# Session 2 — Content & Copywriting

> Separate session from Session 1. ~45 minutes. Output: CONTENT/ folder
> Input: DESIGN.md (from Session 1)
> Skills: none specific
> MCPs: none

## Prerequisites

- Session 1 complete: DESIGN.md + homepage-reference.html committed
- Client business data available (services list, phone, email, address, certifications, opening hours, team info)

## Prompts

### Prompt 1 — Context Loading + Sitemap + Keywords

```
Read the following files before doing anything else:
- DESIGN.md (in project root)
- COMPETITORS.md (in project root)
- CLAUDE.md (in project root)
- C:\Users\yanni\Hub\business\sops\reference-anti-ai-dutch-copywriting.md
- C:\Users\yanni\Hub\business\sops\reference-dutch-copy-research.md

From DESIGN.md, extract and confirm: tone of voice, homepage section order, CTA architecture (button texts, form heading, form subtext), trust signals, je/jij vs u setting, pricing approach.

The anti-AI Dutch copywriting guide is the red thread for ALL copy in this session. Every prompt that follows must apply its rules — the find-and-replace table (Task 2), the red/green flag checklist (Task 6), and the voice guide for this business type (Task 7). The research reference provides evidence-backed examples from real Dutch websites — use it to understand WHAT good Dutch copy actually looks like. Confirm you have read and understood both files.

BUSINESS VIBE ASSESSMENT — answer these before writing any copy:
1. What is the B2B vs B2C split for this business? (0% = pure consumer, 100% = pure B2B)
2. Who visits this website? (e.g., facility managers, homeowners, other business owners)
3. Do visitors already know they need this service, or do they need convincing?
4. What formality level fits? (1=heel informeel like kapper, 3=neutraal-professioneel like kantoorschoonmaak, 5=formeel like advocaat)
5. What's the business scale? (solo owner, small team, larger operation)
6. If this business owner were explaining their work on the phone, how would they sound?

Based on the answers, set these parameters for ALL copy in this session:
- **Fragment tolerance**: formality 1-2 = moderate (OK in body), formality 3+ = minimal (headlines/CTAs only, NEVER in body prose)
- **Particle density**: formality 1-2 = 2-4 per section, formality 3-4 = 1-3 per section, formality 5 = 0-1
- **Particle palette**: formality 3+ = gerust, even, sowieso, dus, want, namelijk. Formality 1-2 = add gewoon, toch, eigenlijk, hoor (sparingly)
- **"Hoor" usage**: ONLY for formality 1-2. Never for B2B service copy.
- **Region mention limit**: max 2x per page (H1 + one body mention). Never in FAQ answers.
- **Social proof**: only verifiable data (real Google review score + count, named testimonials). Never "veel klanten" claims.
- **Business scale language**: match copy to actual business size. No corporate language for small businesses.

SCOPE FOR THIS SESSION:
- Core pages only: homepage, service pages, about, contact, FAQ, legal
- Location pages (werkgebied/[stad]) are a later session — note them in sitemap as "later session" and skip
- Schema markup, technical SEO optimization are a later session

Now define the sitemap and keyword targets for this website.

SITEMAP DEFAULTS BY ARCHETYPE:

Archetype A (Urgent Response — loodgieter, elektricien, dakdekker, installateur):
- Homepage
- Diensten (overview) + individual service pages
- Over ons
- Werkgebied / Service area
- Contact
- FAQ (can be section on homepage + dedicated page)
- Blog (optional — for SEO long-tail)
- Privacy + Algemene voorwaarden

Archetype B (Visual Portfolio — hovenier, schilder, bouwbedrijf, interieurontwerper):
- Homepage
- Diensten (overview) + individual service pages
- Portfolio / Projecten (overview + individual project pages)
- Over ons
- Werkgebied / Service area
- Contact
- FAQ
- Blog (recommended — for SEO)
- Privacy + Algemene voorwaarden

Archetype C (Experience & Atmosphere — restaurant):
- Homepage
- Menu / Menukaart
- Over ons / Het verhaal
- Reserveren
- Contact
- Privacy + Algemene voorwaarden

Archetype D (Clinical Trust — fysiotherapeut, tandarts):
- Homepage
- Behandelingen (overview + individual treatment pages)
- Team / Ons team (individual practitioner pages)
- Tarieven & vergoedingen
- Afspraak maken
- Over de praktijk
- FAQ
- Contact
- Privacy + Algemene voorwaarden

Archetype E (Lifestyle & Personal Brand — kapper, PT, makelaar, schoonmaak):
- Homepage
- Diensten + pricing
- Over ons / Over [naam]
- Reviews / Ervaringen
- Contact
- FAQ
- Blog (optional)
- Privacy + Algemene voorwaarden

Based on the archetype and this client's specific services, create the final sitemap. For each page list:
- Page name (Dutch)
- URL slug (lowercase, hyphens, trailing slash)
- Primary purpose
- Primary keyword target
- Secondary keywords (2-3 natural variations)
- Search intent (informational / transactional / navigational)
- AI SEO opportunity: what question could this page answer in AI Overviews?

Also define the internal linking plan:
- Which pages link to which? (every key page within 3 clicks of homepage)
- Anchor text suggestions (50-60% partial-match, 35-45% branded/generic, max 10% exact-match)

Location pages: note them as "later session — template to be created" and move on.

Save as CONTENT/sitemap.md.
```

---

### Prompt 2 — Homepage Copy

```
Read DESIGN.md sections 5 (Homepage Section Order), 6 (Hero Specification), 9 (CTA Architecture), 10 (Trust Signals), 11 (Pricing Display), and 14 (Dutch UX Requirements).
Read CONTENT/sitemap.md for keyword targets.

Write all homepage copy. Follow these rules strictly:

DUTCH COPY RULES:
- Language: use je/jij (check DESIGN.md section 1 for exceptions)
- Headline max: 7 words / 50 characters
- Subtext: 15-25 words
- CTA button text: max 20 characters (use exact text from DESIGN.md section 9)
- Body paragraphs: 3-5 lines, varied sentence length (some 8 words, some 20+)
- Reading level: B1 — simple, direct, flowing prose. For B2B, model after Exact/Teamleader/Asito (professional but accessible). NOT Coolblue-style fragments for B2B — even Coolblue dials back fragments on their own B2B pages.
- Subheading every 50-75 words
- Apply the fragment/particle/formality settings from the Vibe Assessment in Prompt 1
- Copy should sound like the business owner explaining their work on the phone — natural, direct, knowledgeable
- Use "scanbaar schrijven" — scannability comes from STRUCTURE (headers, whitespace, bold), not from fragmenting every sentence

OPENING TECHNIQUES (from research — use one of these, not a generic opener):
- "Wat als..." scenario-painting (Exact style): paint life WITH the service, then introduce it
- "Klinkt dit bekend?" empathy structure (Teamleader style): name the reader's frustration, then solve it
- Scene-setting (Asito style): place the reader in their physical environment, then introduce the service as natural response
- "Vraag jij je af..." (Coolblue style): voice the reader's internal question, then answer it
- NEVER open with "Welkom op onze website," "Wij zijn [bedrijf]," or why the reader needs the service

BANNED WORDS AND PATTERNS:
- "zonder gedoe," "geen verrassingen," "geen poespas," "scheelt gedoe" — AI clichés
- "eerlijk" as a selling point, "echt schoon" (empty emphasis), "transparant" as selling point
- "bel ons maar even" or "maar even" in CTAs — dismissive-commanding tone
- Standalone fragment emphasis: "Grondig." "Flexibel." "Echt schoon." — every sentence must be grammatically complete in body copy
- "Bovendien," "Daarnaast," "Verder," "Tevens" as paragraph openers — use "dus," "want," "namelijk," or just start the sentence
- Stating the obvious: "Vieze ramen vallen op," "Een schoon kantoor is belangrijk voor..." — the reader already knows their problem
- Unverifiable social proof: "Veel klanten kiezen voor...," "De meeste bedrijven..."
- Never use superlatives ("beste", "#1", "marktleider")
- Never use em dashes (—). Use comma, period, or colon.
- Never use "echter," "tevens," "desalniettemin," "cruciaal," "essentieel," "scala"
- Corporate language that doesn't match business scale (see Vibe Assessment)
- Apply ALL rules from the anti-AI Dutch copywriting guide (find-and-replace table, red/green flags, voice guide)

WHAT TO DO INSTEAD:
- Use accent marks for emphasis: écht, nóg, dát (distinctly Dutch convention)
- Use spoken-language connectors: dus, want, namelijk, rhetorical questions
- Use Dutch idioms and diminutives where natural
- Include "vrijblijvend" near every primary CTA (non-negotiable)
- Include "gerust" or "even" in CTA supporting text
- Include a specific response time: "Binnen 24 uur een reactie"
- Make every claim concrete and verifiable: real numbers, real review scores, real names

AI SEO RULE:
- Start the page with a direct answer paragraph (40-60 words) that answers the primary keyword question. This goes in the hero subtext or immediately below the hero.
- H2 headings should use question format where natural ("Waarom [service]?" rather than "Onze voordelen")

FOR EACH SECTION in the homepage order from DESIGN.md, write:
1. Section heading (H2) — max 5 words / 35 chars
2. Section subheading or intro (if applicable) — max 25 words
3. Section body copy — follow word limits per section type:
   - Hero headline: max 7 words / 50 chars
   - Hero subtext: 15-25 words
   - Service descriptions: 12-20 words each
   - Process steps: 10-15 words per step
   - About section: 80-150 words (2-3 paragraphs)
   - Testimonial placeholders: "[Klant naam] — [Bedrijf/Locatie]" (real reviews added later)
   - CTA section: 15-25 words supporting text
4. Any micro-copy (button text, labels, badges)

Save as CONTENT/homepage.md with clear section markers matching DESIGN.md section order.
```

---

### Prompt 3 — Service Page Copy

```
Read DESIGN.md and CONTENT/sitemap.md.

For each service/subpage in the sitemap (these may be called diensten, behandelingen, programma's, collecties, or any other category depending on the business type), write the full page copy. Each page follows this structure:

1. H1: "[Page naam]" — includes primary keyword naturally
2. Direct answer paragraph (40-60 words): immediately answers "wat is [onderwerp]" or "wat kost [onderwerp]" — front-loaded for AI citation
3. Description (150-250 words): what it includes, how it works, who it's for
4. Why choose us (3-4 bullet points): specific to THIS page topic, not generic company USPs
5. Process: how this specific service is delivered (3-5 steps)
6. Pricing (if DESIGN.md says to show): "vanaf" pricing or price range per DESIGN.md section 11
7. FAQ (3-5 questions specific to this service): question-format, answering real customer questions
   - Include the primary keyword naturally in at least one question
   - Answers: 30-60 words each, direct and factual
8. CTA: specific call-to-action for this service (use CTA text from DESIGN.md section 9)

COPY CONSTRAINTS:
- Total page word count: 400-800 words (enough for SEO, not walls of text)
- Keyword density: 0.5-2% for primary keyword (3-6 natural mentions in 600 words)
- Include 2-3 internal links to other relevant pages (services, contact, about)
- Don't repeat the exact same USP copy on every service page — make each page unique
- Apply ALL anti-AI Dutch copywriting rules AND the Vibe Assessment settings from Prompt 1

SERVICE PAGE SPECIFIC RULES:
- OPEN WITH WHAT YOU DO, NOT WHY THEY NEED IT. The reader is already on this page — they know their problem. "We wassen de ramen van je kantoorpand — buitenkant, binnenkant, of allebei" NOT "Vieze ramen vallen op."
- Don't present service options as a closed list. "Van dagelijks tot maandelijks — je kiest zelf hoe vaak" NOT "Dagelijks, wekelijks of tweewekelijks." If the list of options is genuinely fixed, then a closed list is fine.
- Region name: max 1 mention in the opening paragraph + H1. Never in FAQ answers, process steps, or service descriptions beyond the intro.
- FAQ answers: direct, factual, 30-60 words. No region names. No "veel klanten" claims. Answer starts with the actual answer, not a rephrasing of the question.
- "Why choose us" section: show, don't claim. Named contacts, real review scores, specific numbers. No "professioneel," "betrouwbaar," "flexibel" triple adjective. No "oog voor detail" or other sector clichés.
- Process description: describe real steps in flowing prose. "We komen eerst kijken, dan maken we een voorstel" — NOT "Stap 1: Contact / Stap 2: Offerte / Stap 3: Uitvoering" unless the flowchart format is genuinely clearer.
- Business scale: match language to actual operation size. Don't imply departments, QA teams, or corporate processes that don't exist.

Save each service page as CONTENT/diensten/[service-slug].md.
```

---

### Prompt 4 — About + Contact Pages

```
Read DESIGN.md sections 9 (CTA Architecture) and 14 (Dutch UX Requirements).

Write TWO pages:

--- ABOUT PAGE (CONTENT/over-ons.md) ---

Structure:
1. H1: "Over [Bedrijfsnaam]" or a warmer variant
2. Opening paragraph (50-80 words): who you are, what you do, where you're based. Direct, personal, not corporate.
3. The story (100-150 words): how the business started, why, what drives the owner. Make it feel like meeting a neighbor — warm, authentic, "nuchter."
4. Team section (if applicable): name, role, one personal detail per person. Photo placeholders with alt text descriptions.
5. Certifications/credentials: list with brief explanation of what each means for the customer (not just badge names)
6. Values/approach (3-4 points): what makes working with this business different. Use concrete examples, not corporate values.
7. CTA: "Benieuwd wat we voor je kunnen betekenen?" + primary CTA button

Tone:
- Most personal page on the site
- Use first person ("ik"/"wij") naturally
- Include specific details: years of experience, number of projects, specific expertise
- Sound like someone explaining their work at a verjaardag, not a LinkedIn bio
- If one owner: use "ik" and make it personal. If a team: use "wij" but still name people.

--- CONTACT PAGE (CONTENT/contact.md) ---

Structure:
1. H1: warm invitation, not just "Contact" (e.g., "Neem contact met ons op" or "Laten we kennismaken")
2. Intro (20-40 words): one sentence about what happens when they reach out. Be honest about response times — distinguish between reply time and offerte time: "We reageren binnen [tijd]. Een offerte volgt binnen [tijd]."
3. Contact form:
   - Heading: exact text from DESIGN.md section 9 (form heading)
   - Subtext: exact text from DESIGN.md section 9 (form subtext). Must include "vrijblijvend" and "gerust" — these are non-negotiable trust signals for Dutch service CTAs.
   - Field labels: Naam, Telefoon, E-mail, [dropdown if specified], Bericht (use "je" form matching the rest of the site)
   - Button text: exact from DESIGN.md section 9 (NEVER "Versturen")
   - Privacy note below form: "We gebruiken je gegevens alleen om contact met je op te nemen. Lees ons privacybeleid."
4. Direct contact info:
   - Phone (clickable) — a real, direct phone number. Named contact if possible: "Bel [naam]: [nummer]" (Asito pattern — strongest trust signal in service sector)
   - Email
   - WhatsApp (if in CTA architecture) — increasingly expected for trade/service businesses, signals modernity and low-barrier contact
   - Address: [straat], [postcode] [stad]
   - KvK: [nummer]
5. Opening hours (if applicable)
6. Google Maps embed placeholder (address for the embed)

Keep the contact page minimal — it exists to convert, not to inform.

CTA HONESTY RULES:
- "Offerte aanvragen" on a button is fine — it's the universal Dutch service CTA. Differentiate with supporting text.
- Never promise an "offerte" when the actual first response is just an acknowledgment. Be specific: "We nemen binnen 24 uur contact met je op" vs "Offerte binnen 24 uur."
- Never use "bel ons maar even" — commanding tone. Use "bel gerust" or "neem even contact op."
- Never use "Neem vandaag nog contact op!" — American-style urgency, doesn't work in Dutch.

Save as CONTENT/over-ons.md and CONTENT/contact.md.
```

---

### Prompt 5 — FAQ

```
Read DESIGN.md and all service page copy in CONTENT/diensten/.

Create a comprehensive FAQ page with 8-12 questions. This page is critical for AI SEO — pages with FAQ schema earn significantly more AI citations.

QUESTION SOURCING:
- Include the top questions from each service page FAQ (don't duplicate — link to service page for details)
- Add general business questions:
  - "Wat kost [primary service]?" (pricing question — #1 AI Overview trigger for local businesses)
  - "In welke regio zijn jullie actief?" (service area)
  - "Hoe snel kunnen jullie beginnen?" (timeline/availability)
  - "Zijn jullie verzekerd?" (trust)
  - "Hoe vraag ik een offerte aan?" (process)
  - [Industry-specific question based on archetype]

ANSWER FORMAT (optimized for AI citation):
- First sentence: direct answer to the question (this is what AI extracts)
- Following 2-3 sentences: supporting detail, specifics, context
- Total per answer: 40-60 words
- Include the question's keyword naturally in the answer
- Use concrete numbers where possible (prices, timeframes, counts)

FAQ FORMAT:
## Veelgestelde vragen

### Wat kost [service]?
[Direct answer first.] [Supporting detail.] [Specific example or range.]

### Hoe snel kunnen jullie beginnen?
[Direct answer.] [Supporting detail.]

This format maps directly to FAQPage schema in a later session.

Save as CONTENT/faq.md.
```

---

### Prompt 6 — Legal Pages

```
Create standard legal pages in Dutch. These are required by Dutch law.

1. Privacyverklaring (Privacy Policy):
   - Company details (naam, adres, KvK, e-mail)
   - What data is collected (contact form submissions, analytics)
   - Legal basis: legitimate interest for contact forms, consent for analytics cookies
   - How data is stored and for how long
   - Rights of the user (inzage, correctie, verwijdering, bezwaar)
   - Cookie usage (refer to cookie banner)
   - Contact for privacy questions
   - Last updated date

   Use clear, simple Dutch — not legal jargon. "Wij slaan je naam en e-mailadres op zodat we je aanvraag kunnen beantwoorden" not "De verwerkingsverantwoordelijke verwerkt persoonsgegevens conform de AVG."

2. Algemene voorwaarden (Terms of Service):
   - Only if the client provides services through the website
   - Keep simple for small businesses
   - Include herroepingsrecht (14-day withdrawal right for online bookings)

Save as CONTENT/privacy.md and CONTENT/algemene-voorwaarden.md.
```

---

### Prompt 7 — Meta Tags

```
Read CONTENT/sitemap.md with keyword targets, and all page copy files in CONTENT/.

For each page, draft the meta title and description.

TITLE RULES:
- 50-60 characters max
- Primary keyword near the beginning (front-loaded)
- Brand name at the end: "| [Bedrijfsnaam]"
- Include differentiator where space allows (price, speed, guarantee)

DESCRIPTION RULES:
- 140-155 characters
- Include primary keyword (will be bolded in Google)
- Lead with strongest benefit or value proposition
- Include call-to-action ("Vraag een offerte aan", "Bel ons", etc.)

FORMAT:
## Homepage
Title: [Schoonmaakbedrijf Buren | Kantoren & Bedrijven | Bedrijfsnaam]
Description: [Professioneel schoonmaakbedrijf in Buren. Kantoren, bedrijfshallen, VCA-gecertificeerd. Vraag een vrijblijvende offerte aan.]
H1: [from homepage copy]

## Diensten — [Service naam]
Title: [...]
Description: [...]
H1: [from service page copy]

Save as CONTENT/meta-tags.md.
```

---

### Prompt 8 — Content Review

```
Read all files in the CONTENT/ folder.

Self-audit all copy against this checklist. Apply the FULL red/green flag checklist from the anti-AI copywriting guide (Task 6) — every red flag must be absent, at least 12 of 19 green flags must be present.

HARD FAILS — if ANY of these are true, the copy is NOT ready:

Formatting & structure:
- [ ] All hero headlines are 7 words / 50 characters or fewer
- [ ] All CTA button texts match DESIGN.md section 9 exactly
- [ ] All body text uses je/jij consistently (no mixing with u, unless DESIGN.md specifies u)
- [ ] No em dashes used English-style
- [ ] No Oxford commas
- [ ] No title case in headings
- [ ] All Dutch formatting correct (comma decimals, period thousands, euro symbol before amount)
- [ ] Phone number format: 06-12345678 or local area code
- [ ] Postcode format: 1234 AB

AI-tell elimination:
- [ ] No AI-tell words from the anti-AI copywriting guide (Task 2 find-and-replace table)
- [ ] No "In een wereld waar...," "Bij [bedrijf] begrijpen we...," or similar AI openers
- [ ] No "cruciaal," "essentieel," "scala," "echter," "tevens," "desalniettemin"
- [ ] No "Bovendien," "Daarnaast," "Verder," "Tevens" as paragraph openers
- [ ] No superlatives ("beste", "#1", "marktleider")

Copy quality (from research + gotchas):
- [ ] No "zonder gedoe," "geen verrassingen," "geen poespas," "scheelt gedoe"
- [ ] No standalone fragment emphasis in body copy: "Grondig." "Flexibel." "Echt schoon." (headlines/CTAs excepted based on Vibe Assessment)
- [ ] No "bel ons maar even" or "maar even" in CTAs
- [ ] No sentences stating the obvious ("Vieze ramen vallen op," "Een schoon kantoor is belangrijk")
- [ ] No unverifiable social proof ("Veel klanten kiezen voor...," "De meeste bedrijven...")
- [ ] No corporate language mismatched to business scale
- [ ] Region name appears max 2x per page (H1 + one body mention). Zero times in FAQ answers.
- [ ] Service options not presented as closed lists when they're open-ended
- [ ] No negative framing introducing scenarios the reader wasn't thinking about
- [ ] No sector clichés: "professioneel [beroep]," "oog voor detail," "betrouwbaar, flexibel, professioneel"

Content completeness:
- [ ] Every page has at least one direct answer paragraph in the first 100 words
- [ ] Every H2 on service pages uses question format where natural
- [ ] FAQ answers start with a direct answer sentence
- [ ] "Vrijblijvend" appears near every primary CTA
- [ ] "Gerust" or "even" appears in CTA supporting text
- [ ] A specific response time is mentioned near the contact CTA
- [ ] Internal links present (at least 2-3 per page pointing to other pages)
- [ ] Pricing display matches DESIGN.md section 11 approach
- [ ] KvK, BTW-ID, address present on contact page and footer
- [ ] Privacy page references correct company details
- [ ] Total word count per page is within range (400-800 for service pages, 300-500 for about/contact)
- [ ] No English words or phrases that should be Dutch
- [ ] No placeholders left unfilled (except photo placeholders and real review placeholders)

Quality signals (at least 8 should be present):
- [ ] Contains accent marks for emphasis (écht, nóg, dát) — at least 1-2 per page
- [ ] Contains spoken-language connectors (dus, want, namelijk, rhetorical questions)
- [ ] Contains at least 1 Dutch idiom or diminutive
- [ ] Sentence length varies noticeably (some 8 words, some 20+)
- [ ] Paragraph length varies (some short, some longer)
- [ ] Contains trade-specific vocabulary
- [ ] Modal particles present and calibrated to formality level
- [ ] Opening technique used (scenario-painting, empathy question, scene-setting — not generic)
- [ ] Reading each paragraph aloud sounds natural
- [ ] Copy matches actual business scale and personality

Create a summary:
- Total pages: [X]
- Total word count: [X]
- Issues found: [list]
- Content ready for build session: [yes/no]

If issues found, fix them. When all checks pass, confirm content is ready.
```

-> HUMAN: Review all CONTENT/ files. Optionally send to client for approval before Session 3.
