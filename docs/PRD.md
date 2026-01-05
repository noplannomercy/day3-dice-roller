# Dice Roller - Product Requirements Document

## Project Overview

**Name:** Dice Roller & Coin Flipper  
**Type:** Single Page Application  
**Target:** Tabletop gamers, D&D players, decision makers  
**Timeline:** Day 3 (40-50 minutes)

---

## WHAT (Tech Stack)

**Frontend:**
- HTML5
- Tailwind CSS (via CDN)
- Vanilla JavaScript (ES6+)

**Storage:**
- LocalStorage API

**Structure:**
- Single HTML file
- Modular JS (app.js, dice.js, animation.js, storage.js)
- CSS animations
- No build tools

---

## WHY (Purpose & Goals)

**Primary Goal:**  
Provide realistic dice rolling experience for tabletop gamers

**Target Users:**
- D&D players
- Board game enthusiasts
- Teachers (classroom activities)
- Anyone needing random decisions

**Key Differentiators:**
- Multiple dice types (d4, d6, d8, d10, d12, d20)
- Roll multiple dice at once
- Visual animations
- Comprehensive history
- Quick presets

---

## HOW (Features & Requirements)

### 1. Dice Types & Controls

**Standard Dice:**
- d4 (4-sided)
- d6 (6-sided, standard)
- d8 (8-sided)
- d10 (10-sided, 0-9)
- d12 (12-sided)
- d20 (20-sided)

**Additional:**
- Coin Flip (Heads/Tails)
- d100 (percentile dice, 00-99)

**Controls:**
```
For each dice type:
- [+] button to add
- [-] button to remove
- Display: "3d6" (quantity + type)
- Quick clear all
```

### 2. User Interface

**Layout Structure:**
```
[Header: Dice Roller]

[Dice Selection Panel]
d4  [+][-]  Count: 0
d6  [+][-]  Count: 2
d8  [+][-]  Count: 0
d10 [+][-]  Count: 1
d12 [+][-]  Count: 0
d20 [+][-]  Count: 1

Current: 2d6 + 1d10 + 1d20
[Clear All]

[Roll Button - Large, Prominent]

[Results Display]
┌─────────────────────────────┐
│  d6: [4] [6]               │
│  d10: [7]                  │
│  d20: [15]                 │
│  Total: 32                 │
└─────────────────────────────┘

[Coin Flip Section]
[Flip Coin]
Result: Heads ⚪

[Roll History]
• 2d6+1d10+1d20 = 32 (just now)
• 1d20 = 15 (2 min ago)
• Coin = Tails (5 min ago)
[Clear History]

[Quick Presets]
[1d20] [2d6] [4d6 drop lowest] [1d100]
```

**UI Requirements:**
- Large, clickable buttons
- Clear visual feedback
- Animation on roll
- Mobile-friendly
- Keyboard shortcuts (Space = roll)

### 3. Rolling Logic

**Random Generation:**
```javascript
// For each die:
Math.floor(Math.random() * sides) + 1

// Validation:
- Min: 1
- Max: dice sides
- Truly random (crypto.getRandomValues if available)
```

**Multiple Dice:**
- Roll all dice simultaneously
- Show individual results
- Calculate total
- Support modifiers (+3, -2, etc)

**Special Rules:**
- **Advantage:** Roll 2d20, take higher
- **Disadvantage:** Roll 2d20, take lower
- **Drop lowest:** 4d6, drop lowest (character creation)

### 4. Animation System

**Roll Animation:**
```
1. Shake/spin effect (300ms)
2. Show rolling numbers (200ms)
3. Land on final result (100ms)
4. Highlight critical hits/fails
```

**Visual Feedback:**
- d20 = 20: Gold highlight (critical success)
- d20 = 1: Red highlight (critical fail)
- Total shown prominently
- Smooth transitions

**CSS Animations:**
- Rotate on roll
- Bounce effect
- Number cycling
- Color flash for crits

### 5. History & Presets

**Roll History:**
- Last 20 rolls
- Format: "2d6+1d10 = 15"
- Timestamp
- Persist in LocalStorage
- Click to re-roll same combination

**Quick Presets:**
```javascript
presets = {
  "Attack Roll": "1d20",
  "Damage (2d6)": "2d6",
  "Stat Roll": "4d6 drop lowest",
  "Percentile": "1d100"
}
```

**Custom Presets:**
- Save current dice combination
- Name it
- Quick access
- Max 5 custom presets

### 6. Data Structure

**LocalStorage Schema:**
```javascript
{
  history: [
    {
      dice: "2d6+1d10+1d20",
      results: {d6: [4,6], d10: [7], d20: [15]},
      total: 32,
      timestamp: "2026-01-06T10:30:00"
    }
  ],
  customPresets: [
    {name: "My Attack", dice: "1d20+5"}
  ],
  settings: {
    soundEnabled: true,
    animationSpeed: "normal"
  }
}
```

---

## File Structure

```
day3-dice-roller/
├── index.html       
├── js/
│   ├── app.js       # Main logic
│   ├── dice.js      # Dice rolling logic
│   ├── animation.js # Animation handling
│   └── storage.js   # LocalStorage
└── docs/
    ├── PRD.md
    ├── IMPLEMENTATION.md
    └── PROMPTS-DAY3.md
```

---

## Implementation Sequence

**Phase 1: Basic Structure (10 min)**
1. HTML layout
2. Dice selection UI
3. Roll button

**Phase 2: Core Dice Logic (12 min)**
4. Random number generation (dice.js)
5. Multiple dice handling
6. Total calculation
7. Individual results display

**Phase 3: Animation (10 min)**
8. Roll animation (CSS + JS)
9. Critical hit/fail highlights
10. Number cycling effect

**Phase 4: History & Presets (10 min)**
11. History display
12. Save/load from LocalStorage
13. Quick presets
14. Re-roll from history

**Phase 5: Advanced Features (8 min)**
15. Coin flip
16. Advantage/Disadvantage
17. Modifiers (+/-5)
18. Keyboard shortcuts

---

## CRITICAL RULES

**IMPORTANT:**
- Random generation MUST be truly random
- All dice MUST show individual results
- Critical hits (20) and fails (1) MUST be highlighted
- History MUST persist across sessions
- Animations MUST be smooth (60fps)

**YOU MUST:**
- Validate dice counts (1-99)
- Test random distribution (1000 rolls)
- Show clear visual feedback on roll
- Handle rapid clicking gracefully
- Support keyboard controls

**NEVER:**
- Use predictable random (Date.now())
- Skip individual dice results
- Slow animations that delay results
- Store unlimited history
- Make tiny tap targets (mobile)

**ALWAYS:**
- Show each die's result clearly
- Animate roll action
- Highlight d20 criticals
- Provide instant feedback
- Test on mobile (large buttons)

---

## Success Criteria

**Functional:**
- [ ] All 6 dice types work (d4-d20)
- [ ] Coin flip works
- [ ] Multiple dice roll correctly
- [ ] Total calculated accurately
- [ ] History saves and loads
- [ ] Animations smooth

**Non-Functional:**
- [ ] Roll completes in < 1 second
- [ ] Works on mobile (320px+)
- [ ] No animation jank
- [ ] Buttons large enough (44px min)
- [ ] Critical hits stand out

---

## Testing Checklist

**Random Generation:**
- [ ] d6: Roll 100 times, all 1-6 appear
- [ ] d20: Roll 100 times, distribution even
- [ ] No zeros or out-of-range
- [ ] Truly random (not sequential)

**Multiple Dice:**
- [ ] 3d6 shows 3 individual results
- [ ] Total calculated correctly
- [ ] Different dice types together work
- [ ] Maximum 99 dice handled

**Animations:**
- [ ] Roll animation smooth
- [ ] d20=20 highlighted gold
- [ ] d20=1 highlighted red
- [ ] No layout shift during animation

**History:**
- [ ] Saves after each roll
- [ ] Loads on page refresh
- [ ] Click to re-roll works
- [ ] Clear history works
- [ ] Max 20 items enforced

**Edge Cases:**
- [ ] Roll 0 dice shows error
- [ ] Rapid clicking doesn't break
- [ ] LocalStorage full handled
- [ ] Browser without LocalStorage works

---

## Bonus Features (If Time)

- [ ] Sound effects (optional toggle)
- [ ] Dice notation parser ("2d6+3")
- [ ] Export history as text
- [ ] Dark mode toggle
- [ ] Dice skin customization
