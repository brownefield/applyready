# ApplyReady — Patch Notes

## 2026-11-11 — Restrict `ar_mark_packet_paid` to service_role

Security hardening from the shared-database audit.

- `public.ar_mark_packet_paid` now refuses callers unless `auth.role() = 'service_role'`
- `EXECUTE` revoked from `PUBLIC`, `anon`, and `authenticated`; granted only to `service_role`
- No app or edge caller uses this RPC today (Ready Packet CTA still creates unpaid lead rows only; Stripe checkout is not live)
- Future Stripe webhook must call this with the service role key, never the anon key

## 2026-11-10 — Opportunity completion plan (Readiness Workspace)

**Product shift:** from readiness diagnostic homepage to **Bring Your Own Opportunity** readiness workspace.

### Positioning
- Company sentence: *ApplyReady helps you figure out what you're trying to reach, determines what it requires, shows what you're missing, and helps you get ready to move.*
- Primary interaction: *What are you trying to become ready for?*
- Mental model: **Readiness Workspace** (not one-shot diagnostic)

### Shipped in this patch
- `PRODUCT.md` doctrine (object model, FIND/READY/MOVE, build order, non-goals)
- `DESIGN.md` tokens restored
- Universal object model in `lib/opportunity/` — destination → requirement → evidence → gap → action
- Homepage BYOO intake (paste / describe / template / upload)
- Opportunity workspace at `/ready/[workspaceId]` with evidence checklist + completion plan
- First paid workflow surface: vendor / contracting Ready Packet ($99 CTA)
- Pricing page for FIND / READY / MOVE (+ Partner)
- General diagnostic retained as free FIND module
- Federal resume optimizer remains at `/resume-optimizer` (GENERATE module)
- Footer disclaimer broadened beyond USAJOBS-only framing while preserving non-affiliation

### Copy changes (Helm Voice review required)
- Homepage hero and supporting sentence
- Site metadata / Open Graph
- Pricing page (new)
- Layout nav + disclaimer wording
- Diagnostic intro line pointing users with a specific destination back to BYOO

### Explicitly not in this patch
- Full PDF/RFP AI extraction
- Durable Ready Profile / Evidence Vault persistence
- Separate Mission Finder / VentureFit applications
- Healthcare vertical
- Live payment checkout
