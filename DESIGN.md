# Design System Inspired by Tailscale

> Auto-extracted from `https://tailscale.com/` on 2026-04-23

## 1. Visual Theme & Atmosphere

Friendly, approachable design with rounded shapes and generous whitespace.

The hero section leads with "The best secure connectivity platform for the AI era" followed by "A Zero Trust identity-based connectivity platform that replaces your legacy VPN, SASE, and PAM and c".

**Key Characteristics:**
- Inter as the heading font
- Inter as the body font for all running text
- Heading weight 500, letter-spacing -1.44px
- Light/white background (#f9f7f6) as the primary canvas
- Primary accent `#d04841` used for CTAs and brand highlights
- 2 shadow level(s) detected — tinted shadows
- Rounded corners (8px+) creating a friendly, approachable feel
- Tags: light, rounded, accented, sans-serif

## 2. Color Palette & Roles

### Primary
- **Primary Accent** (`#d04841`) · `--color-primary`: Brand color, CTA backgrounds, link text, interactive highlights.
- **Secondary Accent** (`#5a82de`) · `--color-secondary`: Secondary brand, hover states, complementary highlights.
- **Background** (`#f9f7f6`) · `--color-bg`: Page background, primary canvas.
- **Background Secondary** (`#2e2d2d`) · `--color-bg-secondary`: Cards, surfaces, alternating sections.

### Text
- **Text Primary** (`#181717`) · `--color-text`: Headings and body text.
- **Text Secondary** (`#666666`) · `--color-text-secondary`: Muted text, captions, placeholders.

### Borders & Surfaces
- **Border** (`#2e2d2d`) · `--color-border`: Dividers, outlines, input borders.

### Full Extracted Palette

| # | Hex | CSS Variable | Role | Area | Contrast |
|---|---|---|---|---|---|
| 1 | `#ffffff` | `--palette-1` | block | large | text-dark |
| 2 | `#2e2d2d` | `--palette-2` | block | large | text-light |
| 3 | `#f9f7f6` | `--palette-3` | block | large | text-dark |
| 4 | `#d04841` | `--palette-4` | block | medium | text-light |
| 5 | `#232222` | `--palette-5` | button | medium | text-light |
| 6 | `#efddfd` | `--palette-6` | button | medium | text-dark |
| 7 | `#ffd3cf` | `--palette-7` | button | medium | text-dark |
| 8 | `#cbf4c9` | `--palette-8` | button | small | text-dark |
| 9 | `#f8e5b9` | `--palette-9` | button | small | text-dark |
| 10 | `#cedefd` | `--palette-10` | button | small | text-dark |
| 11 | `#eeebea` | `--palette-11` | badge | small | text-dark |
| 12 | `#5a82de` | `--palette-12` | text-accent | small | text-dark |

## 3. Typography Rules

- **Heading Font:** `Inter`, sans-serif
- **Body Font:** `Inter`, sans-serif

### Type Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing |
|---|---|---|---|---|---|
| H1 | Inter | 48px | 500 | 57.6px | -1.44px |
| H2 | Inter | 48px | 500 | 57.6px | -1.44px |
| H3 | Inter | 48px | 500 | 57.6px | -1.44px |
| Body | MDIO | 14px | 500 | 21px | 0.6px |
| Small | Inter | 14px | 500 | 20px | -0.14px |

### Type Scale

| Token | Size | Suggested Usage |
|---|---|---|
| Display | `64px` | headings |
| H1 | `48px` | headings |
| H2 | `32px` | headings |
| H3 | `20px` | headings |
| H4 | `16px` | headings |
| Body L | `14px` | body / supporting text |
| Body | `12px` | body / supporting text |

## 4. Component Stylings

### Primary Button

```css
.btn-primary {
  background: transparent;
  color: #181717;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  cursor: pointer;
}
```

### Filled Button

```css
.btn-filled {
  background: #232222;
  color: #ffffff;
  border-radius: 8px;
  padding: 0px 12px;
  font-size: 16px;
  font-weight: 500;
  border: 0.8px solid rgb(35, 34, 34);
  cursor: pointer;
}
```

### Filled Button 2

```css
.btn-filled-2 {
  background: #d04841;
  color: #ffffff;
  border-radius: 16px;
  padding: 24px 24px;
  font-size: 16px;
  font-weight: 400;
  border: none;
  cursor: pointer;
}
```

### Ghost Button

```css
.btn-ghost {
  background: transparent;
  color: #2e2d2d;
  border-radius: 16px;
  padding: 24px 24px;
  font-size: 16px;
  font-weight: 400;
  border: none;
  cursor: pointer;
}
```

### Pill Button

```css
.btn-pill {
  background: #1f1e1e;
  color: #ffffff;
  border-radius: 9999px;
  padding: 0px 18px;
  font-size: 14px;
  font-weight: 500;
  border: 0.8px solid rgb(31, 30, 30);
  cursor: pointer;
}
```

### Pill Button 2

```css
.btn-pill-2 {
  background: #ffffff;
  color: #2e2d2d;
  border-radius: 9999px;
  padding: 0px 18px;
  font-size: 14px;
  font-weight: 500;
  border: 0.8px solid rgb(238, 235, 234);
  cursor: pointer;
}
```

### Card

```css
.card {
  background: #2e2d2d;
  border-radius: 32px;
  padding: 64px;
}
```

## 5. Layout Principles

- **Base spacing unit:** `12px` — use multiples (24px, 36px, 48px, etc.)

### Spacing Scale (extracted from real elements)

| Token | Value | Role |
|---|---|---|
| spacing-1 | `12px` | element |
| spacing-2 | `32px` | card |
| spacing-3 | `20px` | element |
| spacing-4 | `10px` | element |
| spacing-5 | `16px` | element |
| spacing-6 | `24px` | card |
| spacing-7 | `64px` | section |
| spacing-8 | `14px` | element |

### Border Radius Scale

| Token | Value | Element |
|---|---|---|
| radius-button | `8px` | button |
| radius-card | `16px` | card |
| radius-card | `32px` | card |

## 6. Depth & Elevation

| Level | Shadow | Usage |
|---|---|---|
| Low | `rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0...` | Cards, subtle elevation |
| Low | `rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0...` | Cards, subtle elevation |


## 7. Do's and Don'ts

### Do
- Use `#f9f7f6` as the primary background color
- Use `Inter` for all headings and `Inter` for body text
- Use `#d04841` as the single dominant accent/CTA color
- Maintain `12px` as the base spacing unit — all gaps should be multiples
- Use rounded corners (`8px`+) consistently for all interactive elements
- Apply the shadow system for elevation — use the extracted shadow values
- Use weight 500 for headings to match the brand's typographic voice

### Don't
- Don't use colors outside the extracted palette without justification
- Don't substitute Inter/Inter with generic alternatives
- Don't use irregular spacing — stick to 12px grid
- Don't use dark/black backgrounds — this is a light-themed design
- Don't use sharp corners — they feel hostile in this rounded design language
- Don't use pure black (#000000) for text — use `#181717` instead
- Don't add decorative elements not present in the original design — no badges, ribbons, banners, or ornaments unless the source site uses them
- Don't invent UI patterns the source site doesn't have — if the original has no NEW badge, don't add one just because a red is in the palette

## 8. Responsive Behavior

| Breakpoint | Width | Notes |
|---|---|---|
| Mobile | < 640px | Single column, stack sections, reduce font sizes ~80% |
| Tablet | 640–1024px | 2-column where appropriate, maintain spacing ratios |
| Desktop | 1024–1440px | Full layout as designed |
| Wide | > 1440px | Max-width container, center content |

- Touch targets: minimum 44×44px on mobile
- Maintain 12px base unit across breakpoints — only scale multipliers

## 9. Agent Prompt Guide

### Quick Color Reference

```
Background:  #f9f7f6
Text:        #181717
Accent:      #d04841
Secondary:   #5a82de
Border:      #2e2d2d
```

### Example Prompts

1. "Build a hero section with a `#f9f7f6` background, `Inter` heading in `#181717`, and a `#d04841` CTA button with 8px radius."
2. "Create a pricing card using background `#2e2d2d`, border `#2e2d2d`, `Inter` for text, and 36px padding."
3. "Design a navigation bar — `#f9f7f6` background, `#181717` links, `#d04841` for active state."
4. "Build a feature grid with 3 columns, 36px gap, each card using the card component style."
5. "Create a footer with `#181717` background, `#f9f7f6` text, and 24px padding."

### Iteration Guide

1. Start with layout structure (sections, grid, spacing)
2. Apply colors from the palette — background first, then text, then accents
3. Set typography — font families, sizes from the type scale, weights
4. Add components — buttons, cards, inputs using the specs above
5. Apply border-radius consistently across all elements
6. Add shadows for depth — use the extracted shadow values, not defaults
7. Check responsive behavior — test mobile and tablet layouts
8. Final pass — verify all colors match, spacing is consistent, fonts are correct
