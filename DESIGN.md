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

Each color gets a standard light→dark scale (`50` to `950`) plus optional in-between anchors (e.g. `25`) when Figma has a distinct, reusable role.

| Token name | Role |
|---|---|
| `--brand-*` | Primary brand color |
| `--gray-*` | Neutral UI chrome — Careplus-aligned; see gray scale notes below |
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

### Gray scale (Careplus-aligned)

Rebuilt from Figma variable hex in the Docswell-for-Portfolio file. **Seven stops are pinned exactly**; the rest are generated in OKLCH perceptual space.

| Stop | Hex | Source |
|---|---|---|
| `--gray-25` | `#f8fafb` | Figma Background/Disabled [0] — disabled input/control fill |
| `--gray-50` | `#f6f8fa` | Figma Background/Normal [25] |
| `--gray-100` | `#eceff3` | Figma Border/Normal [50] |
| `--gray-200` | `#dfe1e7` | Figma Border/Hover [100] |
| `--gray-300` | `#a4acb9` | Figma Icon/Disabled [300] |
| `--gray-400` | `#818898` | Figma Text/Subdued [400] |
| `--gray-500` | `#666d80` | Figma Text/Normal [500] |
| `--gray-700` | `#36394a` | Figma Text/Muted [600] — primary UI emphasis |
| `--gray-600` | `#4f5567` | OKLCH: L at 45% between 500→700, shared hue |
| `--gray-800`–`950` | `#262a36` → `#07080b` | OKLCH extrapolation; chroma tapered toward black |

**Method:** Convert each Figma anchor to OKLCH (L = perceptual lightness, C = chroma, H = hue). Compute circular mean hue from text stops 400/500/700 (~271°). Interpolate missing L along that hue; reduce C at light extremes and deep shadows so neutrals do not pick up muddy saturation. Round-trip to sRGB hex.

**Semantic mapping (our naming, not Figma’s):**

| Token | Stop | Figma equivalent |
|---|---|---|
| `--color-foreground` | `--gray-700` | Their “Text/Muted” (darkest UI text) |
| `--color-foreground-muted` | `--gray-500` | Their “Text/Normal” |
| `--color-foreground-subtle` | `--gray-400` | Their “Text/Subdued” |
| `--color-foreground-disabled` | `--gray-300` | Their Icon/Disabled |

Contrast on white: gray-700 ~11.4:1, gray-500 ~5.2:1, gray-400 ~3.6:1 — all intentional; primary is softer than near-black while still passing AA.

### Semantic color tokens

**Surfaces & text**

| Token | Maps to | Usage |
|---|---|---|
| `--color-foreground` | `--gray-700` | Primary text (headings, labels) |
| `--color-foreground-muted` | `--gray-500` | Secondary text, body descriptions |
| `--color-foreground-subtle` | `--gray-400` | Subtle metadata / tertiary text |
| `--color-foreground-disabled` | `--gray-300` | Disabled labels, icons |
| `--color-text-placeholder` | `--gray-400` | Input placeholder text |
| `--color-text-hint` | `--gray-500` | Helper text below fields (normal) |
| `--color-text-hint-disabled` | `--gray-300` | Helper text below disabled fields |
| `--color-icon-subtle` | `--gray-400` | Neutral control icons |
| `--color-icon-disabled` | `--gray-300` | Disabled control icons |
| `--color-surface-hover` | `--gray-100` | Row/menu hover |
| `--color-surface-pressed` | `--gray-200` | Pressed neutral surface |
| `--color-background-disabled` | `--gray-25` | Disabled input/button fill |
| `--color-border-disabled` | `--gray-100` | Disabled control border |
| `--color-border` | `--gray-200` | Dividers, input borders |

**Actions** (each variant: fill, hover, active, text; disabled where noted)

| Variant | Fill | Hover | Active | Text |
|---|---|---|---|---|
| Primary | `--brand-500` | `--brand-600` | `--brand-700` | `--white` |
| Secondary | `--gray-100` | `--gray-200` | — | `--gray-700` |
| Ghost | `transparent` | `--gray-100` | — | `--gray-700` |
| Outline | `transparent` | `--gray-50` | — | `--gray-700` (+ `--color-action-outline-border`) |
| Destructive | `--red-600` | `--red-700` | — | `--white` |

Primary actions use `--color-action-primary` / `-hover` / `-active` (brand-500 → 600 → 700). **Accent** tokens (`--color-accent`, `--color-accent-emphasis`) are for links, chrome, and brand moments on light surfaces — not primary button fills.

Disabled filled buttons (primary, destructive) and secondary all use `--color-background-disabled` + `--color-foreground-disabled` with no shadow.

Shared interaction semantics are available for generic controls and surfaces:
`--color-state-hover`, `--color-state-active`, `--color-state-focus`, `--color-state-disabled-text`, `--color-state-disabled-bg`, `--color-state-disabled-border`.

**Feedback**

| Token | Maps to | Usage |
|---|---|---|
| `--color-success` | `--green-600` | Success icon, border |
| `--color-success-surface` | `--green-100` | Success banner/badge background |
| `--color-success-foreground` | `--green-700` | Text on success-surface |
| `--color-success-border` | `--green-600` | Success border |
| `--color-warning` | `--amber-600` | Warning icon, border |
| `--color-warning-surface` | `--amber-100` | Warning banner/badge background |
| `--color-warning-foreground` | `--amber-600` | Text on warning-surface (darkest amber primitive) |
| `--color-warning-border` | `--amber-600` | Warning border |
| `--color-error` | `--red-600` | Error icon, border |
| `--color-error-surface` | `--red-100` | Error banner/badge background |
| `--color-error-foreground` | `--red-700` | Text on error-surface |
| `--color-error-border` | `--red-600` | Error border |
| `--color-info` | `--blue-600` | Info icon, border |
| `--color-info-surface` | `--blue-100` | Info banner/badge background |
| `--color-info-foreground` | `--blue-700` | Text on info-surface |
| `--color-info-border` | `--blue-600` | Info border |

**Overlay**

| Token | Value | Usage |
|---|---|---|
| `--color-overlay-scrim` | `#00000066` | Modal/drawer backdrop (40% black) |

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

**Components and product UI use semantic tokens** (`styles/semantic/typography.css`). Primitives (`styles/tokens/typography.css`) are the scale; change a primitive once to shift every semantic alias.

### Semantic tokens (Tier 2)

| Token | Maps to | Usage |
|---|---|---|
| `--font-body` | `--font-sans` | Body copy, UI, buttons, inputs |
| `--font-heading` | `--font-display` | Page titles, section headings, brand marks |
| `--font-code` | `--font-mono` | Code samples, token names |
| `--text-body` | `--text-base` | Default body and UI text |
| `--text-body-secondary` | `--text-sm` | Meta, nav, secondary copy |
| `--text-caption` | `--text-xs` | Captions, hints, fine print |
| `--text-lead` | `--text-lg` | Intro under a page title |
| `--text-label` | `--text-body` | Form labels, table headers |
| `--text-input` | `--text-body` | Input text |
| `--text-hint` | `--text-caption` | Input helper text |
| `--text-button` | `--text-body` | Button labels |
| `--text-overline` | `--text-caption` | Eyebrow/overline text |
| `--text-link` | `--text-body` | Inline/app links |
| `--text-heading-subsection` | `--text-lg` | Card titles, tertiary headings |
| `--text-heading-section` | `--text-2xl` | Section headings |
| `--text-heading-page` | `--text-3xl` | Primary page title in app chrome |
| `--text-heading-hero` | `--text-4xl` | Hero / documentation page titles |
| `--text-heading-display` | `--text-5xl` | Marketing/display headings |
| `--font-weight-body` | `--font-normal` | Body copy |
| `--font-weight-label` | `--font-medium` | Labels |
| `--font-weight-button` | `--font-medium` | Action labels |
| `--font-weight-heading` | `--font-semibold` | Headings |
| `--tracking-overline` | `--tracking-wider` | Eyebrow treatment |
| `--leading-body` | `--leading-normal` | Default UI line height |
| `--leading-body-relaxed` | `--leading-relaxed` | Paragraphs, long-form |
| `--leading-heading` | `--leading-tight` | Display and section headings |
| `--leading-label` | `--leading-snug` | Dense UI labels |
| `--leading-input` | `--leading-normal` | Form fields |
| `--leading-hint` | `calc(16 / 12)` | 12px hint text with Figma 16px line-height |
| `--leading-button` | `--leading-snug` | Compact action labels |

### Primitive families

| Token | Value | Notes |
|---|---|---|
| `--font-sans` | `Inter`, ui-sans-serif, system-ui, … | Body primitive |
| `--font-display` | `Open Sauce One`, ui-sans-serif, system-ui, … | Heading primitive |
| `--font-mono` | ui-monospace, JetBrains Mono, Fira Code, … | Code primitive |

### Primitive type scale (fluid-ready)

Compact UI scale — **14px body** at a typical 16px browser root (`--text-base: 0.875rem`).

| Token | Size (typical) | Usage |
|---|---|---|
| `--text-xs` | 0.75rem (12px) | Labels, captions |
| `--text-sm` | 0.8125rem (13px) | Secondary body, meta |
| `--text-base` | 0.875rem (14px) | Primary body copy |
| `--text-lg` | 1rem (16px) | Lead text |
| `--text-xl` | 1.125rem (18px) | Small headings |
| `--text-2xl` | 1.25rem (20px) | Section headings |
| `--text-3xl` | 1.5rem (24px) | Page headings |
| `--text-4xl` | 1.875rem (30px) | Hero headings |
| `--text-5xl` | 2.25rem (36px) | Display |

---

## Radius

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | 0.25rem | Subtle rounding (tags, badges) |
| `--radius-base` | 0.375rem | Default controls (inputs, buttons) |
| `--radius-md` | 0.5rem | Larger controls/cards |
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

Always pair `prefers-reduced-motion` overrides (already in `app.css` base layer):
```css
@media (prefers-reduced-motion: reduce) {
  * { transition-duration: 0.01ms !important; }
}
```

---

## Z-index

A fixed scale prevents ad-hoc stacking numbers and cross-component z-index conflicts. Components reference these primitives directly (no semantic aliases yet — the layer names are already self-documenting).

| Token | Value | Usage |
|---|---|---|
| `--z-0` | 0 | Reset / natural flow |
| `--z-10` | 10 | Raised content |
| `--z-20` | 20 | Sticky headers |
| `--z-30` | 30 | Dropdowns, popovers |
| `--z-40` | 40 | Modals, drawers |
| `--z-50` | 50 | Toasts, notifications |
| `--z-max` | 9999 | Escape hatches |

---

## Base layer (`@layer base` in `app.css`)

Global element defaults for product UI — not a token tier. Rules consume **semantic** color/type tokens; spacing and radius use **primitives** until role-based aliases exist.

Tailwind Preflight still handles resets (margins on lists, etc.); base only adds brand decisions.

| Element | Tokens / notes |
|---|---|
| `body` | `--color-background`, `--color-foreground`, `--font-body`, `--text-body`, `--leading-body` |
| `h1`–`h3` | `--font-heading`, `--text-heading-page` / `section` / `subsection`, `--leading-heading`, `--font-semibold` |
| `h4`–`h6` | `--font-heading` + primitive sizes (`--text-xl` → `--text-body`); `h6` uses `--font-medium` |
| `p` | `margin-block-end: --spacing-4` |
| `a` | `--color-accent`, `--color-accent-hover`, underline + offset |
| `strong`, `b` | `--font-semibold` |
| `code` | `--font-code`, `--text-caption`, `--color-accent-subtle`, `--radius-sm` |
| `img` | responsive block |
| `hr` | `--color-border`, `--spacing-6` vertical margin |
| `button`, inputs | `font`/`color` inherit only; borders and fills belong in components |
| `:focus-visible` | `--color-border-focus`, `--radius-sm` |
| `prefers-reduced-motion` | zero effective transition/animation duration |

Documentation site (`.docs` namespace) keeps its own typography; base targets unclassed HTML in product pages.

---

## Components

Components are added here as they're built. Each entry notes variants, tokens consumed, and any decisions made.

### Button

Four variants sharing a 32px height, 6px radius, and consistent state coverage (hover, active, disabled, focus-visible).

#### Primary (`btn btn--primary`)

Brand fill with shadow keyline and lift. Hover/active darken the fill; focus uses the shared brand shadow ring.

| State | Fill | Chrome | Text |
|---|---|---|---|
| Default | `--color-action-primary` (brand-500) | `--shadow-button-primary-rest` | white |
| Hover | `--color-action-primary-hover` (brand-600) | same shadow | white |
| Active | `--color-action-primary-active` (brand-700) | same shadow | white |
| Disabled | `--color-background-disabled` (gray-25) | none | `--color-foreground-disabled` |
| Focus | — | `--shadow-input-focus` (brand keyline + halo) | white |

| Property | Value | Token |
|---|---|---|
| Radius | 6px | `--button-radius` |
| Padding | 8×6px | `--button-padding-inline` / `--button-padding-block` |

#### Secondary (`btn btn--secondary`)

Elevated neutral button — white background with shadow keyline and lift (no CSS border). Hover/active use solid gray washes; label shifts to loud text on interaction.

| State | Fill | Chrome | Text |
|---|---|---|---|
| Default | `--color-surface` (white) | `--shadow-button-secondary-rest` | `--color-foreground` (gray-700) |
| Hover | `--color-action-outline-hover` (gray-50) | same shadow | `--color-foreground-loud` |
| Active | `--color-surface-hover` (gray-100) | same shadow | `--color-foreground-loud` |
| Disabled | `--color-background-disabled` (gray-25) | none | `--color-foreground-disabled` (gray-300) |
| Focus | — | `--shadow-input-focus` (brand keyline + halo) | — |

#### Destructive (`btn btn--destructive`)

Danger fill with shadow keyline and lift. Same state model as primary; focus reuses the error-input shadow ring.

| State | Fill | Chrome | Text |
|---|---|---|---|
| Default | `--color-action-destructive` (red-600) | `--shadow-button-destructive-rest` | white |
| Hover | `--color-action-destructive-hover` (red-700) | same shadow | white |
| Active | `--red-800` | same shadow | white |
| Disabled | `--color-background-disabled` (gray-25) | none | `--color-foreground-disabled` |
| Focus | — | `--shadow-input-error` (red keyline + halo) | white |

All filled button variants share the same pattern: `shadow-rest` at rest/hover/active, role-colored `shadow-focus` on `:focus-visible`, flat disabled with no chrome.

### Input

Figma-aligned text input with semantic roles for placeholder, hint, and icon colors.

| Property | Token | Figma reference |
|---|---|---|
| Radius | `--input-radius` → `--radius-base` (6px) | Input radius 6 |
| Padding | `--input-padding-inline` / `--input-padding-block` | 8px / 6px |
| Label gap | `--input-gap-label-control` | 4px |
| Hint gap | `--input-gap-control-hint` | 6px |
| Rest chrome | `--input-shadow-rest` → `--shadow-input-rest` | Form/Input/Normal |
| Placeholder | `--input-placeholder` → `--color-text-placeholder` | Text/Subdued [400] |
| Hint (normal) | `--input-hint` → `--color-text-hint` | Text/Normal [500] |
| Hint (disabled) | `--input-hint-disabled` → `--color-text-hint-disabled` | Text/Disabled [300] |
| Icon (normal) | `--input-icon` → `--color-icon-subtle` | Icon/Subdued [400] |
| Icon (disabled) | `--input-icon-disabled` → `--color-icon-disabled` | Icon/Disabled [300] |

#### Icon-only modifier (`btn--icon`)

Square modifier (32×32px) for icon-only buttons. Combine with any variant: `btn btn--secondary btn--icon`. Uses `--button-icon-size: 2rem`. Always pair with `aria-label` for accessibility.

### Dropdown

Closed trigger sharing Input chrome and Figma Form/Input shadow states. Component tokens alias Input where values match; placeholder uses hint-tone gray-500 instead of input placeholder gray-400.

| Property | Token | Figma reference |
|---|---|---|
| Radius / padding / shadows | `--dropdown-*` → `--input-*` | Same as Input |
| Placeholder | `--dropdown-placeholder` → `--color-text-hint` | Text/Normal [500] |
| Hover text | `--dropdown-text-hover` → `--color-foreground` | Text/Muted [600] + medium |
| Filled value | `--dropdown-text-filled` → `--color-foreground-loud` | Selected option text |
| Icon size | `--dropdown-icon-size` → `--spacing-5` (20px) | Leading + chevron |
| Hint gap | `--dropdown-gap-control-hint` | 6px via `dropdown__content` |

States: normal, hover (shadow + placeholder emphasis), filled, focus, error, disabled — same modifiers as Input (`dropdown--error`, `dropdown--disabled`, `aria-invalid`).

### Checkbox

Square control (16px) centered in a 24px hit target. Unchecked uses dedicated gray checkbox shadows; checked/focus uses brand-primary blue (Figma purple recolored).

| Property | Token | Figma reference |
|---|---|---|
| Hit target | `--checkbox-size` → `--spacing-6` (24px) | Outer frame |
| Control | `--checkbox-control-size` → `--spacing-4` (16px) | Inner box |
| Radius | `--checkbox-radius` → `--radius-xs` (3px) | Rounded square |
| Checked fill | `--checkbox-bg-checked` → `--color-action-primary` | Primary/100 → brand-500 |
| Rest chrome | `--checkbox-shadow-rest` | Form/Checkbox & Radio/Normal |
| Hover | `--checkbox-shadow-hover` | Form/Checkbox & Radio/Hover |
| Focus / pressed | `--checkbox-shadow-focus` | Primary Active geometry → brand |
| Checked rest | `--checkbox-shadow-selected` | 1px brand keyline |
| Disabled | `--checkbox-bg-disabled` / `--checkbox-border-disabled` | gray-25 + gray-100 border |

States: normal, hover, pressed (unchecked focus), selected, selected focus, indeterminate, disabled (checked).

#### Label + description

Add `checkbox--with-description` and wrap copy in `checkbox__text`. Control top-aligns; label uses `--text-label` (medium 14px); description uses `--text-body` regular at `--color-text-hint`. Hovering anywhere on the label row updates unchecked control chrome.

### Radio

Circular control sharing Form/Checkbox & Radio shadows with checkbox. Selected = brand-500 fill + 6px white center dot (`--shadow-radio-dot` lift). `radio-group` / `fieldset` stacks options.

| Property | Token | Figma reference |
|---|---|---|
| Hit / control | `--radio-size` / `--radio-control-size` | 24px / 16px |
| Selected fill | `--radio-bg-checked` → `--color-action-primary` | Primary/100 → brand-500 |
| Dot | `--radio-dot-size` (6px), `--radio-dot-shadow` | White center on selected |
| Chrome | `--radio-shadow-*` → `--shadow-checkbox-*` | Shared Normal/Hover/Focus |
| Label layout | Same pattern as checkbox (`radio--with-description`) | 6px gap, label + description |

States: normal, hover, focus, selected, selected focus, disabled (selected dot in gray).

---

## Figma sync

Figma is used as **visual reference only**. The existing Figma component libraries use legacy techniques and are not copied into code structure.

When pulling from Figma via MCP:
- Extract spacing, color, and radius values and map to existing tokens
- If a Figma value doesn't map cleanly, check if a new token is warranted or if the design needs adjustment
- Document any divergences between Figma and the code system here

---

## Changelog

### 0.3.16 — Radio component
- Added `--shadow-radio-dot` primitive (brand-tinted dot lift on selected radio)
- Added `styles/components/radio.css` with 6 control states + label/description layout mirroring checkbox
- Added `radio-group` fieldset pattern for option sets; focus/selected recolored to brand-primary

### 0.3.15 — Checkbox label + description
- Added `--checkbox-gap-control-text` (6px), `--checkbox-label`, `--checkbox-description`, `--checkbox-label-padding-block` component tokens
- `checkbox--with-description` + `checkbox__text` / `checkbox__description` layout; row hover propagates to control via `:has()`
- Docs: normal / hover / selected matrix for label + description variant

### 0.3.14 — Checkbox component
- Added `--radius-xs` (3px) primitive for checkbox/radio corners
- Added `--shadow-checkbox-rest`, `--shadow-checkbox-hover`, `--shadow-checkbox-focus`, `--shadow-checkbox-selected` primitives (focus/selected recolored to brand-primary)
- Added `styles/components/checkbox.css` with 7 Figma states; docs state matrix + interactive examples

### 0.3.13 — Dropdown component + input hint gap
- Added `styles/components/dropdown.css` with Tier 3 tokens aliasing Input chrome; placeholder maps to `--color-text-hint` (gray-500); hover promotes placeholder to `--color-foreground` + medium weight
- Input and Dropdown use `__content` wrapper for Figma-aligned 6px control→hint gap (`--input-gap-control-hint` / `--dropdown-gap-control-hint`)
- Docs preview: normal, disabled, filled, focused, error states; interactive native `<select>` demo

### 0.3.12 — Input error state
- Added `--shadow-input-error` using system reds (`red-600` keyline/outer ring, `red-800` lift) with Figma error geometry
- Added `--color-text-hint-error` semantic and `--input-hint-error` / `--input-shadow-error` component tokens
- Error state via `input--error` or `aria-invalid="true"`; error hint supports icon + `role="alert"`

### 0.3.11 — Input filled state
- Added `--input-text-filled` (`--color-foreground-loud`) for entered-value text in filled state
- Added docs snapshot class `input__control--filled` to show filled state separately from focus
- Input preview now demonstrates normal, disabled, filled, and focused states

### 0.3.10 — Input focus state (brand-tinted)
- Added `--shadow-input-focus` with the same 4-layer geometry as Figma focus (`1px keyline`, `2px white spacer`, `3px outer ring`, `1px/2px lift`)
- Recolored Figma purple focus treatment to Docswell primary blue family (`brand-500/600` tints)
- Input focus now maps to `--input-shadow-focus: var(--shadow-input-focus)` and uses loud field text via `--color-foreground-loud`

### 0.3.12 — Destructive button shadow chrome
- Destructive button aligned with primary/secondary: red keyline + lift (`--shadow-button-destructive-rest`), focus via `--shadow-input-error`
- Disabled matches other variants (gray-25, no shadow); removed `--button-destructive-border*` tokens
- All filled variants now share one state model: shadow-rest → shadow-focus → flat disabled

### 0.3.11 — Primary button shadow chrome
- Primary button now uses brand keyline + lift (`--shadow-button-primary-rest`) instead of matching CSS border
- Focus uses `--shadow-input-focus` (shared brand shadow ring with secondary/inputs)
- Disabled: flat gray-25 fill, no shadow — aligned with secondary and Figma
- Removed `--button-primary-border*` component tokens

### 0.3.10 — Secondary button Figma alignment
- Secondary button now uses shadow keyline + lift (`--shadow-button-secondary-rest`) instead of CSS border
- Hover/active: gray-50 / gray-100 solid fills with loud text on interaction; focus uses `--shadow-input-focus` (brand)
- Disabled: flat fill, no shadow; shared button gap set to 6px (`--button-gap` → `--spacing-1_5`)
- Removed `--button-secondary-border`; text tokens now map to `--color-foreground` / `--color-foreground-loud`

### 0.3.9 — Input hover shadow
- Added `--shadow-input-hover` from Figma Form/Input/Hover (`#09194829` spread + lift)
- Added `--input-shadow-hover` component token and mapped `.input__control:hover` to it
- Disabled inputs keep `box-shadow: none` on hover

### 0.3.8 — Input semantic cleanup + component tokens
- Added semantic color roles for form text/icons: placeholder, hint (normal/disabled), and icon (normal/disabled)
- Added `--spacing-1_5` (6px) and `--radius-base` (6px) primitives for Figma-aligned control geometry
- Added `--shadow-input-rest` primitive using Figma blue-tinted spread shadow (`#09194821` + `#12376914`)
- Added `styles/components/input.css` with component tokens for normal/disabled input states and enabled it in `app.css`
- Updated semantic typography: `--text-label` now maps to 14px body size, added `--text-hint` and `--leading-hint`

### 0.3.7 — Disabled background primitive
- Added `--gray-25` (`#f8fafb`) from Figma Background/Disabled [0] (Chandima-Kit input)
- `--color-background-disabled` now maps to `--gray-25`, distinct from sidebar `--gray-50`

### 0.3.6 — Careplus-aligned gray scale
- Rebuilt `--gray-*` primitives from Figma hex anchors (50–500, 700); 600 and 800–950 OKLCH-interpolated
- `--color-foreground` now maps to `--gray-700` (`#36394a`) — soft primary text, not near-black
- Disabled text/icons map to `--gray-300` (`#a4acb9`); action label text uses `--gray-700`
- Documentation site swatches and `DESIGN.md` gray methodology updated

### 0.3.5 — Semantic typography + state coverage
- Expanded semantic typography for common SaaS UI roles: label/input/button/link/overline, display heading, role weights, and role line heights
- Added generic interactive state semantics (`--color-state-*`) for hover/active/focus/disabled in non-action contexts
- Added feedback border semantics (`--color-*-border`) for success, warning, error, and info states

### 0.3.4 — Priority token gap fills
- Added `styles/tokens/z-index.css` — 7-step z-index primitive scale (`--z-0` through `--z-max`)
- Added feedback foreground tokens: `--color-success-foreground`, `--color-warning-foreground`, `--color-error-foreground`, `--color-info-foreground` — text color for use on matching `*-surface` backgrounds
- Added `--color-overlay-scrim` (`#00000066`) — 40% black for modal/drawer backdrops

### 0.3.3 — Flat primary button, simplified tokens
- Removed skeuomorphic shine/rim/ring layers from primary button — now a flat brand-color fill
- Renamed all variant tokens from `--button-*-fill` → `--button-*-bg` and `--button-*-ring` → `--button-*-border` to follow standard design system naming
- All three variants (primary, secondary, destructive) now share consistent `bg` / `bg-hover` / `bg-active` / `text` / `border` token structure
- Updated docs page token tables and states reference

### 0.3.2 — Primary button flat hover/active
- Hover and active use darker flat fills (brand-600 / 700); shine and rim layers apply on rest only
- Removed `--button-primary-shine-hover-start` and `--button-primary-rim-hover-start`
- Documentation site: per-variant state matrices (rest/hover/active/disabled/focus), updated copy and states reference table; `btn--docs-*` snapshot classes in `docs.css`

### 0.3.1 — Primary action scale alignment
- Retuned `--color-action-primary` ladder: brand-500 (fill) → 600 (hover) → 700 (active)
- Added `--color-action-primary-active`; primary button fill/ring now map to action semantics (not `--color-accent-emphasis`)
- Documentation site swatches and token tables updated

### 0.3.0 — Button variant expansion
- Added secondary (`btn--secondary`), destructive (`btn--destructive`), and icon-only (`btn--icon`) variants
- Each variant has full state coverage: hover, active, disabled, focus-visible
- Component tokens added for secondary and destructive fills, borders, and rings
- Documentation updated with previews, usage, token tables, and states reference

### 0.2.0 — Primary button component
- Added `styles/components/button.css` — skeuomorphic primary button from Figma `714:3053`
- Documentation site: Components → Button section with live preview and token table

### 0.1.9 — Minimum base layer
- Extended `@layer base` in `app.css`: headings `h1`–`h6`, `p`, `a`, `strong`, `code`, `img`, `hr`, bare control inherit reset
- Documented base element → token mapping in `DESIGN.md`

### 0.1.8 — Semantic typography (Tier A)
- Added `styles/semantic/typography.css` — 14 role-based tokens (families, body/heading sizes, line heights)
- `body`, documentation site shell, and `DESIGN.md` updated to consume semantic typography
- Documentation site typography section lists semantic tokens and maps each to its primitive

### 0.1.7 — 14px body type scale
- `--text-base` is now `0.875rem` (14px at default root); full scale shifted for compact UI density
- Documentation site type scale labels updated

### 0.1.6 — Documentation site semantic color catalog
- Colors page lists all 52 semantic tokens, grouped by role (surfaces, actions, accent, feedback)

### 0.1.5 — Action, disabled, and surface interaction tokens
- Added secondary, ghost, outline, and destructive action semantics (fill, hover, text, disabled)
- Added disabled foreground/background/border tokens for controls
- Added `--color-surface-hover` and `--color-surface-pressed` for neutral interaction
- Documentation site semantic swatches updated

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
