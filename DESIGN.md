# docswell-ds — Design System

A startup design system built the modern way. This document records *decisions* — the why behind every token, convention, and structural choice. Update it when decisions change.

---

## Principles

1. **Tokens first.** Every visual value lives in a token. No hardcoded colors, spacing, or radii in component CSS.
2. **Three tiers.** Primitives → Semantic → Component. Components consume semantic tokens only.
3. **One source of truth.** Change a semantic token, every component that uses it updates. No grep-and-replace.
4. **Ship small.** Add tokens and components when a real UI need arises — not speculatively.
5. **Accessible by default.** WCAG AA contrast, `:focus-visible`, `prefers-reduced-motion` from day one.

---

## Stack

| Concern | Choice | Why |
|---|---|---|
| Markup | HTML5 (semantic) | No framework overhead for a learning/startup project |
| Styling | Tailwind v4 + plain CSS | Tokens become CSS variables AND utility classes; CSS-first; no config file |
| Scripting | Vanilla JS | Behavior only — no presentation in JS |
| Colors | Hex (`#rrggbb`) | Industry-standard primitives; matches Figma and most token pipelines |
| Build | Tailwind CLI (binary) | Single file, no Node framework, watches and compiles |

### Why Tailwind v4 specifically

Tailwind v4 removed `tailwind.config.js`. All tokens are defined in CSS inside an `@theme {}` block. This means:
- Your design tokens and your utility classes are the same thing
- No duplication between a config file and CSS variables
- Native CSS custom properties — usable anywhere, including JS

---

## Token System

### Three-Tier Hierarchy

```
Tier 1 — Primitives   (styles/tokens/)
  Raw values. No semantic meaning. The full palette.
  e.g. --blue-500, --gray-100, --space-4

Tier 2 — Semantic     (styles/semantic/)
  Purpose-driven aliases. Reference primitives.
  e.g. --color-background, --color-action-primary, --color-error
  ↑ This is what components use.

Tier 3 — Component    (styles/components/)
  Scoped to one component. Reference semantic tokens.
  e.g. --button-radius: var(--radius-md)
```

**Rule:** Components reference semantic tokens. Semantic tokens reference primitives. Never skip a tier.

### Why this matters

If the brand color changes, you update one primitive (`--brand-500`). The semantic alias (`--color-action-primary`) picks it up. Every component picks it up automatically.

---

## Color System

### Color format: hex

```css
/* 6-digit hex — primitives in styles/tokens/colors.css */
--blue-500: #0d7dd4;
```

**Why hex:** Matches what most teams use in Figma, brand guidelines, and design-token JSON. Easy to copy from design tools without conversion. Scales are tuned by eye or imported from Figma variables; contrast is verified when wiring semantic tokens.

**Alpha when needed:** Use 8-digit hex (`#0000001a`) for shadow opacity, or `color-mix()` when deriving alpha from a semantic CSS variable (e.g. focus rings).

### Primitive palette structure

Each color gets an 11-step scale: `50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950`.

| Token name | Role |
|---|---|
| `--brand-*` | Primary brand color |
| `--gray-*` | Neutral UI chrome |
| `--green-*` | Success / positive |
| `--red-*` | Error / destructive |
| `--amber-*` | Warning |
| `--blue-*` | Info / links |

### Background model (product-aligned)

Careplus uses a **flat white canvas**: the main content area and cards are both white; borders (not background contrast) separate cards. The nav sidebar alone uses a subtle gray tint.

| Token | Maps to | Usage |
|---|---|---|
| `--color-background` | `--white` | Main canvas, content area |
| `--color-background-sidebar` | `--gray-50` | Nav rail, app chrome |
| `--color-surface` | `--white` | Cards, modals, panels |

`--color-background` and `--color-surface` share the same hex by design. Semantic names stay distinct so a future tinted canvas can diverge without refactors.

### Semantic color tokens

| Token | Maps to | Usage |
|---|---|---|
| `--color-foreground` | `--gray-900` | Primary text |
| `--color-muted` | `--gray-500` | Secondary text, placeholders |
| `--color-border` | `--gray-200` | Dividers, input borders |
| `--color-action-primary` | `--brand-600` | CTA buttons, links |
| `--color-action-primary-hover` | `--brand-700` | Hover on primary actions |
| `--color-success` | `--green-600` | Success states |
| `--color-warning` | `--amber-500` | Warning states |
| `--color-error` | `--red-600` | Error states, destructive |
| `--color-info` | `--blue-500` | Info, help text |

The system ships with a single light theme. Alternate themes can be added later by overriding semantic tokens — not component CSS.

---

## Spacing

**Base unit: 4px (0.25rem).** All spacing tokens are multiples of 4.

| Token | Value | Tailwind class |
|---|---|---|
| `--space-1` | 0.25rem (4px) | `p-1`, `m-1`, etc. |
| `--space-2` | 0.5rem (8px) | `p-2` |
| `--space-3` | 0.75rem (12px) | `p-3` |
| `--space-4` | 1rem (16px) | `p-4` |
| `--space-6` | 1.5rem (24px) | `p-6` |
| `--space-8` | 2rem (32px) | `p-8` |
| `--space-12` | 3rem (48px) | `p-12` |
| `--space-16` | 4rem (64px) | `p-16` |

---

## Typography

Two complementary sans serifs: **Inter** for body and UI, **Open Sauce One** for headings and the logotype. Inter is loaded from the canonical [rsms.me/inter](https://rsms.me/inter/) CDN; Open Sauce One from [Fontsource](https://fontsource.org/fonts/open-sauce-one) (SIL OFL). System fonts remain as fallbacks so the UI degrades gracefully if web fonts fail to load.

| Token | Value | Notes |
|---|---|---|
| `--font-sans` | `Inter`, ui-sans-serif, system-ui, … | Body text, UI, labels |
| `--font-display` | `Open Sauce One`, ui-sans-serif, system-ui, … | Page titles, section headings, brand marks |
| `--font-mono` | ui-monospace, JetBrains Mono, Fira Code, … | Code samples, token names |

### Type scale (fluid-ready)

| Token | Size | Usage |
|---|---|---|
| `--text-xs` | 0.75rem | Labels, captions |
| `--text-sm` | 0.875rem | Secondary body, meta |
| `--text-base` | 1rem | Primary body copy |
| `--text-lg` | 1.125rem | Lead text |
| `--text-xl` | 1.25rem | Small headings |
| `--text-2xl` | 1.5rem | Section headings |
| `--text-3xl` | 1.875rem | Page headings |
| `--text-4xl` | 2.25rem | Hero headings |

---

## Radius

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | 0.25rem | Subtle rounding (tags, badges) |
| `--radius-md` | 0.5rem | Inputs, buttons |
| `--radius-lg` | 1rem | Cards, modals |
| `--radius-xl` | 1.5rem | Large panels |
| `--radius-full` | 9999px | Pills, avatars |

---

## Motion

Motion tokens prevent inconsistent animation throughout the UI.

| Token | Value | Usage |
|---|---|---|
| `--duration-fast` | 100ms | Hover states, tooltips |
| `--duration-normal` | 200ms | Button feedback, dropdowns |
| `--duration-slow` | 300ms | Modals, drawers |
| `--duration-slower` | 500ms | Page transitions |
| `--ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | Elements entering |
| `--ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | Elements leaving |
| `--ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | State changes |
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Playful pop (modals) |

Always pair `prefers-reduced-motion` overrides:
```css
@media (prefers-reduced-motion: reduce) {
  * { transition-duration: 0.01ms !important; }
}
```

---

## Components

Components are added here as they're built. Each entry notes variants, tokens consumed, and any decisions made.

<!-- Added as components are built -->

---

## Figma sync

Figma is used as **visual reference only**. The existing Figma component libraries use legacy techniques and are not copied into code structure.

When pulling from Figma via MCP:
- Extract spacing, color, and radius values and map to existing tokens
- If a Figma value doesn't map cleanly, check if a new token is warranted or if the design needs adjustment
- Document any divergences between Figma and the code system here

---

## Changelog

### 0.1.4 — Light theme only
- Removed dark-mode CSS overrides (`prefers-color-scheme`, `data-theme`) from semantic colors
- Renamed `--color-foreground-on-dark` → `--color-foreground-inverse` (filled/brand surfaces, not a theme)
- Docs site and `DESIGN.md` updated to reflect single light theme

### 0.1.3 — Open Sauce One display typeface
- `--font-display` now uses Open Sauce One; body remains Inter via `--font-sans`
- Documentation site loads Open Sauce One (400–700) from Fontsource CDN and updates typography copy

### 0.1.2 — Documentation site + Inter typography
- Added Inter + InterDisplay (rsms.me) as the system typefaces; `--font-display` token introduced for headings/logo
- Added `--spacing-40`, `--spacing-64`, `--spacing-72` for navigation rail and large-layout needs
- New `styles/components/docs.css` houses the documentation site shell, isolated under the `.docs` namespace so it cannot leak into product UI
- `index.html` rewritten as the **Seri (静利)** design system documentation site — sidebar navigation, primitive sections (colors, typography, spacing, radius, shadows, motion)

### 0.1.1 — Hex color primitives
- Switched Tier 1 color primitives from OKLCH to hex for Figma/industry alignment
- Updated shadow tokens to 8-digit hex alpha
- Documented hex as the standard format in project rules

### 0.1.0 — Initial setup
- Chose Tailwind v4 (CSS-first, `@theme` directive)
- Defined three-tier token hierarchy
- Established file structure: `styles/tokens/`, `styles/semantic/`, `styles/components/`
