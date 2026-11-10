# ApplyReady — Design Tokens (v1)

Open Design schema — locked visual language for ApplyReady surfaces.

## Type

| Role | Family | Notes |
|------|--------|-------|
| Display / brand | Cormorant Garamond | Weighted serif; hero and section titles |
| Body | System sans | `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, etc. |

## Color

| Token | Value | Use |
|-------|-------|-----|
| `navy` | `#0B1F33` | Primary actions, brand weight |
| `ink` | `#10151B` | Body text |
| `amber` | `#B8842B` | Accent — muted, never bright gold |
| `paper` | `#FAF7F0` | Page background |
| `muted` | `#6B7280` | Supporting copy |
| `line` | `#E4DFD3` | Rules / borders |

## Shape

- Card radius: `10px` (`rounded-card`)
- Prefer soft edges over sharp newspaper rules
- Avoid gradients, glow, and trendy motion noise

## Aesthetic

Minimal, symbolic, intentional. Maritime-adjacent restraint.

## Motion

Use intentional presence, not decoration:

1. Hero intake focus / soft entrance
2. Requirement list reveal after parse
3. Status transitions on evidence checklist (satisfied → gap → action)

## Layout doctrine (product)

- Brand is a hero-level signal on branded pages
- First viewport: brand, one headline, one supporting sentence, one primary intake, one CTA group
- Cards only when they contain interaction (intake, checklist, packet offer)
- One job per section
