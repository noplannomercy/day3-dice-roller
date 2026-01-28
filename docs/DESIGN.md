# Digital Dice Roller - Design Guide

> Fantasy RPG aesthetic inspired by D&D character sheets and Roll20

## Design Philosophy

**Theme**: Medieval Fantasy / Tabletop RPG
**Mood**: Mystical, aged parchment, candlelit tavern atmosphere
**Target**: Board gamers, TRPG players seeking authentic gaming experience

---

## Color Palette

### Primary Colors
```css
--primary: #f2cc0d           /* Gold - main accent */
--background-dark: #221f10   /* Deep brown - dark mode background */
--background-light: #f8f8f5  /* Cream - light mode background */
```

### Secondary Colors
```css
--bronze-dark: #8b5e3c       /* Bronze shadow */
--bronze-light: #b8860b      /* Bronze highlight */
--parchment: #f4e4bc         /* Aged paper */
--leather-brown: #5d4037     /* Dark leather */
--stone: #8b5e3c             /* Stone/border accent */
```

### Semantic Colors
```css
--critical-success: #f2cc0d  /* Gold glow for d20=20 */
--critical-fail: #dc2626     /* Red for d20=1 */
--text-primary: #ffffff      /* White on dark */
--text-secondary: rgba(255, 255, 255, 0.6)  /* Dimmed white */
```

---

## Typography

### Font Families
```css
font-family: "Newsreader", serif;  /* Primary - medieval serif */
```

**Usage:**
- **Headers**: Newsreader (italic, bold) - "The Grand Stage", "Arcane Roller"
- **Body**: Newsreader (regular) - all UI text
- **Display Numbers**: Newsreader (extrabold, italic) - dice results

### Type Scale
```css
/* Headers */
--text-4xl: 2.25rem   /* Main title "The Grand Stage" */
--text-xl: 1.25rem    /* Section headers */

/* Display */
--text-9xl: 8rem      /* Giant result number */
--text-3xl: 1.875rem  /* Button text "ROLL DICE" */

/* Body */
--text-base: 1rem     /* Regular text */
--text-sm: 0.875rem   /* Secondary text */
--text-xs: 0.75rem    /* Tiny labels */
```

### Font Weights
- **Extrabold (800)**: Result numbers
- **Bold (700)**: Buttons, headers, labels
- **Regular (400)**: Body text, descriptions

### Text Effects
```css
.gold-glow {
    text-shadow: 0 0 15px rgba(242, 204, 13, 0.6);
}
```
Applied to: Main title, large result numbers

---

## Layout Structure

### Grid System
- **Container max-width**: 960px
- **Responsive breakpoints**:
  - Mobile: < 640px (grid-cols-3)
  - Desktop: ≥ 1024px (grid-cols-6, lg:grid-cols-3)

### Spacing Scale (Tailwind)
```
gap-2  = 0.5rem   (8px)
gap-3  = 0.75rem  (12px)
gap-4  = 1rem     (16px)
gap-6  = 1.5rem   (24px)
gap-8  = 2rem     (32px)
```

### Component Layout
```
┌─────────────────────────────────────┐
│  Header (sticky)                    │
├─────────────────────────────────────┤
│  Title "The Grand Stage"            │
│                                     │
│  ┌─┬─┬─┬─┬─┬─┐                     │
│  │d│d│d│d│d│d│  Dice Selector      │
│  │4│6│8│0│2│0│                     │
│  └─┴─┴─┴─┴─┴─┘                     │
│                                     │
│  ┌──────┬────────────────────┐     │
│  │Qty/  │  Result Display    │     │
│  │Mod   │  (Giant Number)    │     │
│  └──────┴────────────────────┘     │
│                                     │
│       [ROLL DICE Button]            │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  Roll History (Parchment)   │   │
│  └─────────────────────────────┘   │
├─────────────────────────────────────┤
│  Footer                             │
└─────────────────────────────────────┘
```

---

## Component Styles

### 1. Dice Type Buttons
**Dimensions**: 64x64px icon area
**States**:
- Default: `border-white/10`, transparent
- Hover: `border-primary/50`, `bg-primary/5`, scale-110
- Active: `border-primary`, `bg-primary/10`, gold shadow

**Icons**: Material Symbols (change_history, square, pentagon, diamond, hexagon, interests)

```css
.dice-button {
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 0.5rem;
    padding: 0.75rem;
    transition: all 0.2s;
}

.dice-button:hover .icon {
    transform: scale(1.1);
}

.dice-button.active {
    border-color: #f2cc0d;
    background: rgba(242, 204, 13, 0.1);
    box-shadow: 0 0 10px rgba(242, 204, 13, 0.2);
}
```

### 2. Result Display Area
**Layout**: Double border frame, centered content
**Background**: `bg-black/40` with decorative overlay

```css
.result-display {
    padding: 3rem;
    background: rgba(0, 0, 0, 0.4);
    border: 4px double rgba(242, 204, 13, 0.2);
    border-radius: 1.5rem;
}

/* Giant result number */
.result-number {
    font-size: 8rem;
    font-weight: 800;
    font-style: italic;
    text-shadow: 0 0 15px rgba(242, 204, 13, 0.6);
}

/* Individual dice results */
.die-value {
    padding: 0.5rem 1rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 9999px;
    color: #f2cc0d;
    font-weight: bold;
}
```

### 3. Roll Button
**Style**: Bronze gradient with embossed relief effect

```css
.roll-button {
    width: 100%;
    max-width: 20rem;
    padding: 1.5rem;
    border-radius: 0.75rem;
    background: linear-gradient(to bottom, #b8860b, #8b5e3c);
    box-shadow:
        inset 0 2px 4px rgba(255, 255, 255, 0.2),
        0 4px 10px rgba(0, 0, 0, 0.5);
    border: 2px solid #8b5e3c;
    transition: transform 0.2s;
}

.roll-button:hover {
    transform: scale(1.02);
}

.roll-button:active {
    transform: scale(0.98);
}
```

### 4. History Panel (Parchment Style)
**Background**: Aged paper texture with border

```css
.parchment-texture {
    background-color: #f4e4bc;
    background-image: url([texture-image]);
    border: 8px double rgba(139, 94, 60, 0.3);
    border-radius: 0.5rem;
}

.history-entry {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid rgba(139, 94, 60, 0.1);
    transition: background 0.2s;
}

.history-entry:hover {
    background: rgba(0, 0, 0, 0.05);
}
```

---

## Textures & Backgrounds

### Leather Background
```css
.leather-texture {
    background-image: url([leather-pattern]);
    /* Dark brown leather with subtle grain */
}
```

### Parchment Paper
```css
.parchment-texture {
    background-color: #f4e4bc;
    background-image: url([paper-texture]);
    box-shadow: inset 0 0 40px rgba(0, 0, 0, 0.1);
}
```

### Overlay Pattern (Dot Grid)
```css
background: radial-gradient(#494222 1px, transparent 1px);
background-size: 40px 40px;
opacity: 0.2;
```

---

## Effects & Animations

### Glow Effects
```css
/* Gold glow for emphasis */
.gold-glow {
    text-shadow: 0 0 15px rgba(242, 204, 13, 0.6);
}

/* Radial glow behind elements */
.glow-orb {
    background: rgba(242, 204, 13, 0.2);
    filter: blur(3rem);
    border-radius: 50%;
}
```

### Interactive States
```css
/* Button press feedback */
.interactive:active {
    transform: scale(0.95);
}

/* Hover scale */
.hover-grow:hover {
    transform: scale(1.1);
    transition: transform 0.2s;
}
```

### Decorative Elements
- **Corner ornaments**: Circular borders with primary color (40px border, opacity 10%)
- **Background icons**: Material symbols at 300px size, 5% opacity
- **Borders**: Double borders for parchment areas

---

## Iconography

**Library**: Material Symbols Outlined
**Weights**: 100-700
**Fill**: 0-1 (outline vs filled)

### Dice Icons Mapping
- **d4**: `change_history` (triangle)
- **d6**: `square`
- **d8**: `pentagon` (filled)
- **d10**: `diamond`
- **d12**: `hexagon` (filled)
- **d20**: `interests` (icosahedron)

### UI Icons
- Casino/dice: `casino`
- History: `history_edu`
- Settings: `settings`
- Decorative: `auto_awesome`, `shield`
- Copy: `content_copy`

---

## Responsive Behavior

### Mobile (< 640px)
- Dice grid: 3 columns
- Stack controls vertically
- Full-width buttons
- Reduce result number size

### Desktop (≥ 1024px)
- Dice grid: 6 columns
- Side-by-side layout (controls | result)
- Fixed max-width container (960px)
- Larger spacing

### Touch Targets
- Minimum: 44x44px (buttons)
- Dice buttons: 80x80px total area
- Roll button: Full width on mobile, 320px on desktop

---

## Accessibility

### Color Contrast
- Text on dark background: White (#fff) on #221f10 ✓
- Gold accent: #f2cc0d on dark backgrounds ✓
- History panel: Dark text (#5d4037) on parchment (#f4e4bc) ✓

### Interactive Feedback
- `:hover` states for all interactive elements
- `:active` transform for tactile feedback
- Clear focus indicators (keyboard navigation)
- Semantic HTML (buttons, nav, main, footer)

### Screen Readers
- Semantic heading hierarchy (h1, h2, h3)
- Alt text for decorative backgrounds (`data-alt`)
- ARIA labels where needed (future enhancement)

---

## Design Tokens (CSS Variables)

```css
:root {
  /* Colors */
  --color-primary: #f2cc0d;
  --color-bg-dark: #221f10;
  --color-bg-light: #f8f8f5;
  --color-bronze: #8b5e3c;
  --color-parchment: #f4e4bc;

  /* Spacing */
  --space-unit: 0.25rem;
  --space-sm: calc(var(--space-unit) * 2);   /* 0.5rem */
  --space-md: calc(var(--space-unit) * 4);   /* 1rem */
  --space-lg: calc(var(--space-unit) * 8);   /* 2rem */

  /* Border Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-full: 9999px;

  /* Transitions */
  --transition-fast: 0.15s ease-out;
  --transition-base: 0.2s ease-out;
  --transition-slow: 0.3s ease-out;
}
```

---

## Implementation Notes

### Technology Stack
- **Framework**: Tailwind CSS (CDN)
- **Icons**: Google Material Symbols
- **Fonts**: Google Fonts (Newsreader)
- **Images**: External URLs for textures

### CSS Approach
- Utility-first (Tailwind)
- Custom classes for complex effects (`.gold-glow`, `.bronze-relief`)
- Minimal custom CSS (inline `<style>` tag)

### Performance
- GPU acceleration: `transform: translateZ(0)`, `will-change`
- Optimized images: WebP textures with fallbacks
- CDN-hosted assets (Tailwind, fonts, icons)

---

## Future Enhancements

### Animation System
- Dice roll animation (3D rotation)
- Number counting effect (0 → result)
- Particle effects on critical rolls
- Shake/rumble on button press

### Dark Mode
- Already implemented via Tailwind `dark:` classes
- Toggle in settings menu

### Theming
- Alternative color schemes (blue arcane, red infernal, green nature)
- Customizable textures (clean, worn, ancient)

---

## Design Credits

**Generated with**: Google Stitch AI
**Inspiration**: D&D 5e character sheets, Roll20, Fantasy Grounds
**Color Palette**: Medieval manuscripts, aged parchment, candlelight
**Typography**: Renaissance-era serif fonts
