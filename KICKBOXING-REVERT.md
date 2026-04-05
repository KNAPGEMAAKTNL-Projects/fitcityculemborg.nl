# Kickboxing → Bokszaktraining: Revert Guide

## What changed (April 2025)
Kickboxlessen are temporarily paused because the trainer left. The website now shows **bokszaktraining** (self-paced punching bag training) instead of kickboxing (instructor-led lessons).

## Last commit before this change
```
8bb0d40 fix: homepage pricing toggle after view transitions
```

To see the full diff: `git log --oneline 8bb0d40..HEAD`

## When to revert
When a new kickboxing trainer is found and lessons resume.

## How to revert
The simplest approach is to revert the commit that made this change:

```bash
# Find the bokszaktraining commit
git log --oneline --all --grep="bokszaktraining"

# Revert it
git revert <commit-hash>
```

## Files that were changed
1. `src/data/navigation.ts` — nav label "Bokszaktraining" → "Kickboxing"
2. `src/data/pricing.ts` — plan names, features, extras
3. `src/components/ContactForm.astro` — dropdown option text
4. `src/pages/index.astro` — service card, gallery, vibe checklist, descriptions
5. `src/pages/kickboxing/index.astro` — entire page content
6. `src/pages/fitness/index.astro` — references and FAQ
7. `src/pages/ladies-only/index.astro` — related link text
8. `src/pages/over-ons/index.astro` — about text
9. `src/pages/faq/index.astro` — FAQ answers

## What to update when reverting
- Remove the yellow "kickboxlessen tijdelijk gepauzeerd" notice
- Change "bokszaktraining" back to "kickboxing" / "kickboksen"
- Restore the schedule: dinsdag 19:00, donderdag 19:00, zondag 10:00
- Restore instructor-led lesson descriptions (technique, combinations, cooling-down)
- Update pricing plan names back to "Kickboxing 1x p/w", "Kickboxing Unlimited"

## Schedule reference
**Current (bokszaktraining):** di + do 19:00 (from mei also ma + wo)
**Original (kickboxing):** di + do 19:00, zo 10:00
