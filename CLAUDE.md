# ApplyReady — Claude Code Operating Doctrine

## What ApplyReady Is
Federal and state job-readiness platform. AI-assisted resume optimization for USAJOBS and state postings. Built and operated under Brownefield Holdings LLC. Live at applyready-psi.vercel.app. Domain: applyready.work (Namecheap).

**Not affiliated with the U.S. federal government or any agency.** This disclaimer must be visible on the site footer at minimum.

## Stack
- Framework: Next.js (App Router)
- Hosting: Vercel (auto-deploy on push to `main`)
- Repo: github.com/brownefield/applyready
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

## Doctrine — Federal Resume Facts
- **Federal resumes follow OPM/USAJOBS standards.** The traditional "two-page max" guidance is the baseline reference, though many federal resumes run longer based on series and grade.
- **Never claim "3–5× longer" as a flat stat** — that contradicts OPM guidance and was flagged in the June 2026 audit. Use the current corrected language in the codebase. Do not regress.
- KSAs, specialized experience statements, and series/grade alignment are core value drivers.

## Monetization Tiers
- **Free** — basic optimizer access
- **ApplyReady Pro** — individual paid tier
- **ApplyReady Partner** — $299 setup + $99/month, sold to workforce orgs / nonprofits / reentry programs

## File Conventions
- Components in `/components`
- Pages in `/app` (App Router)
- Static assets in `/public`
- Patch notes in `/PATCH.md` (append, don't overwrite)
- Design tokens in `/DESIGN.md`

## Workflow Rules for Claude Code
1. **Always show diffs before applying.** Never auto-accept changes to production copy or pricing pages.
2. **When updating user-facing copy,** flag it explicitly: "This changes copy on [page]" — Helm Voice review required.
3. **Never push directly to `main` without explicit instruction.** Default to feature branches or staged commits awaiting approval.
4. **Preserve the non-affiliation disclaimer.** If it disappears from any layout, restore it.
5. **Federal resume claims must match OPM/USAJOBS guidance.** If asked to write marketing copy, flag any stat claim for source verification.

## Active Items (as of June 2026)
- PATCH.md applied for stat correction and disclaimer
- DESIGN.md v1 drafted (Open Design schema)
- GitHub MCP not yet connected — pushes done via terminal with PAT
- Three-tier pricing live

## Parent Architecture
Brownefield owns the keys. Waypoint defines the route. FormBuddy opens the door.
ApplyReady is a productized service under Brownefield Holdings, routed through Waypoint OS doctrine.
