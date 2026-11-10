# ApplyReady — Claude Code Operating Doctrine

## What ApplyReady Is
**Readiness Workspace** under Brownefield Holdings LLC. Live at applyready-psi.vercel.app. Domain: applyready.work (Namecheap).

ApplyReady turns an opportunity into a completion plan:

> Show ApplyReady what you're trying to qualify for. We'll determine what it requires, what you already have, what's missing, and help you finish the rest.

Architecture with the parent stack:

> **Find → Ready → Move**  
> Mission Finder / VentureFit → ApplyReady → FormBuddy / Waypoint

**Not affiliated with the U.S. federal government or any agency.** This disclaimer must be visible on the site footer at minimum.

Product doctrine lives in `PRODUCT.md`. Design tokens in `DESIGN.md`. Patch notes in `PATCH.md`.

## Stack
- Framework: Next.js (App Router)
- Hosting: Vercel (auto-deploy on push to `main`)
- Repo: github.com/brownefield/applyready
- Data: Supabase (`brownefield-core`) — diagnostic RPCs live; opportunity workspaces start client-side
- Vercel team: team_hbzTLUNe79NFMIiuZMCiOAsV
- Vercel project: prj_loZCl13Yrie75kBAJ6fkozxvZeAz

## Design System (Locked)
- **Primary typeface:** Cormorant Garamond (serif, weighted)
- **Body typeface:** System sans (clean, readable)
- **Primary color:** Darker navy (#0B1F33 range — not pure black, not bright blue)
- **Accent color:** Muted amber (#B8842B range — never bright gold)
- **Background:** Off-white / warm paper tone
- **Aesthetic:** Minimal, symbolic, intentional. Maritime-adjacent restraint. Avoid clutter, gradients, and trendy motion.

## Tone — Helm Voice
All user-facing copy follows Helm Voice:
- Grounded, understated, calm authority
- Maritime-influenced phrasing where natural — never forced
- Minimal and precise; cut every unnecessary word
- No spiritual clichés, no generic motivation, no hype language
- No exclamation points unless deeply earned

## Object Model
```text
DESTINATION → REQUIREMENT → EVIDENCE → GAP → ACTION
```

Operating loop: **DISCOVER → QUALIFY → PREPARE → COMPLETE → TRACK**  
Action verbs: **KEEP / ROUTE / GENERATE / AUTOMATE** (+ TRACK)

## Doctrine — Federal Resume Facts
- Federal resume optimization remains a **GENERATE** module (`/resume-optimizer`), not the homepage center of gravity.
- **Federal resumes follow OPM/USAJOBS standards.** The traditional "two-page max" guidance is the baseline reference, though many federal resumes run longer based on series and grade.
- **Never claim "3–5× longer" as a flat stat** — that contradicts OPM guidance and was flagged in the June 2026 audit. Use the current corrected language in the codebase. Do not regress.
- KSAs, specialized experience statements, and series/grade alignment are core value drivers for the job pathway.

## Monetization
- **FIND (free)** — Mission Finder / VentureFit modules, general diagnostic
- **READY** — Ready Check (~$29) for a specific opportunity analysis
- **MOVE** — Ready Packet (~$99); Guided Ready (~$249+)
- **ApplyReady Partner** — $299 setup + $99/month for workforce orgs / nonprofits / programs

Do not sell “government contracting advice.” Position against SBA/APEX as: they tell you what you need; ApplyReady organizes, proves, prepares, and tracks it.

## File Conventions
- Components in `/components`
- Pages in `/app` (App Router)
- Domain logic in `/lib` (`readiness/` diagnostic; `opportunity/` workspace)
- Static assets in `/public`
- Patch notes in `/PATCH.md` (append, don't overwrite)
- Design tokens in `/DESIGN.md`
- Product doctrine in `/PRODUCT.md`

## Workflow Rules for Claude Code
1. **Always show diffs before applying.** Never auto-accept changes to production copy or pricing pages.
2. **When updating user-facing copy,** flag it explicitly: "This changes copy on [page]" — Helm Voice review required.
3. **Never push directly to `main` without explicit instruction.** Default to feature branches or staged commits awaiting approval.
4. **Preserve the non-affiliation disclaimer.** If it disappears from any layout, restore it.
5. **Federal resume claims must match OPM/USAJOBS guidance.** If asked to write marketing copy, flag any stat claim for source verification.
6. **Do not sprawl.** No separate VentureFit/Mission Finder apps, healthcare vertical, marketplace, or score-library chase until one paid workflow is proven.

## Active Items
- Opportunity completion plan / Bring Your Own Opportunity surface in progress
- First paid workflow to prove: small-business vendor / opportunity readiness
- Ready Profile / Evidence Vault next after paid proof
- Diagnostic MVP retained as free FIND module
- DESIGN.md / PRODUCT.md / PATCH.md restored

## Parent Architecture
Brownefield owns the keys. Waypoint defines the route. FormBuddy opens the door.
ApplyReady is a productized service under Brownefield Holdings, routed through Waypoint OS doctrine.
