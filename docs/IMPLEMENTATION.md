# Dice Roller - Implementation Plan

## Overview
**Total Time:** 40-50 minutes
**Approach:** TDD (Test-Driven Development)
**Files:** index.html, js/dice.js, js/animation.js, js/storage.js, js/app.js

---

## Dice Range Definition (IMPORTANT)
| Dice | Range | Notes |
|------|-------|-------|
| d4   | 1-4   | Standard |
| d6   | 1-6   | Standard |
| d8   | 1-8   | Standard |
| d10  | 0-9   | Zero-indexed (PRD spec) |
| d12  | 1-12  | Standard |
| d20  | 1-20  | Standard |
| d100 | 00-99 | Percentile (PRD spec) |

---

## Phase 1: Basic Structure (10 min) ✅ COMPLETED

### Setup
- [x] Create project folder structure
- [x] Create index.html with Tailwind CDN
- [x] Create js/ folder with empty module files

### HTML Layout
- [x] Header section with title "Dice Roller"
- [x] Dice selection panel (d4, d6, d8, d10, d12, d20, d100)
- [x] Each dice row: label + [-] button + count + [+] button
- [x] Current selection display ("2d6 + 1d10 + 1d20")
- [x] Clear All button
- [x] Large Roll button (prominent, 44px+ height)
- [x] Results display area (max-height with scroll)
- [x] Coin flip section
- [x] History section with Clear History button
- [x] Quick presets row

### Styling
- [x] Mobile-first responsive layout (320px+)
- [x] Large touch targets (min 44px)
- [x] Clear visual hierarchy
- [x] Tailwind utility classes only
- [x] Button :active state for touch feedback
- [x] Results area: max-height + overflow-y: auto

### Test: Phase 1 Verification
- [x] Page loads without errors
- [x] All dice type rows visible
- [x] Buttons are clickable size (44px+)
- [x] Layout works on 320px viewport
- [x] Layout works on landscape mode
- [x] No console errors

---

## Phase 2: Core Dice Logic (12 min)

### Write Tests First (js/dice.js)
- [ ] Test: rollDie(6) returns 1-6 only
- [ ] Test: rollDie(20) returns 1-20 only
- [ ] Test: rollDie(4) returns 1-4 only
- [ ] Test: rollD10() returns 0-9 (zero-indexed)
- [ ] Test: rollD100() returns 00-99 (percentile)
- [ ] Test: 1000 rolls of d6, each value within ±20% of expected (166.67)
- [ ] Test: 1000 rolls of d20, each value within ±20% of expected (50)
- [ ] Test: rollMultiple(3, 6) returns array of 3 results
- [ ] Test: calculateTotal([{d6: [3,4]}, {d10: [7]}]) = 14
- [ ] Test: no out-of-range values ever returned

### Implement dice.js
- [ ] rollDie(sides) - single die roll using Math.random()
- [ ] rollD10() - returns 0-9 (special case)
- [ ] rollD100() - returns 00-99 (special case)
- [ ] rollMultiple(count, sides) - roll multiple dice of same type
- [ ] rollAll(diceConfig) - roll all selected dice
- [ ] calculateTotal(results) - sum all dice results
- [ ] formatResults(results) - format for display

### Dice Selection Logic
- [ ] Track dice counts: {d4: 0, d6: 2, d8: 0, d10: 1, d12: 0, d20: 1}
- [ ] Increment dice count (max 99)
- [ ] Decrement dice count (min 0)
- [ ] Clear all dice counts
- [ ] Format current selection string ("2d6 + 1d10 + 1d20")

### Connect to UI
- [ ] [+] buttons increment dice count
- [ ] [-] buttons decrement dice count
- [ ] Display updates on count change
- [ ] Roll button triggers rollAll()
- [ ] Results display shows individual dice results
- [ ] Total prominently displayed

### Test: Phase 2 Verification
- [ ] Run 1000 d6 rolls - distribution within ±20% per value
- [ ] Run 1000 d20 rolls - distribution within ±20% per value
- [ ] d10 returns 0-9 only
- [ ] d100 returns 00-99 only
- [ ] 3d6 shows exactly 3 individual results
- [ ] Total calculation is accurate
- [ ] +/- buttons work correctly
- [ ] Count displays update
- [ ] Roll with 0 dice shows appropriate message

---

## Phase 3: Animation (10 min)

### Write Tests First (js/animation.js)
- [ ] Test: animateRoll() starts animation
- [ ] Test: animateRoll() completes within 600ms
- [ ] Test: highlightCritical(20, 'd20') applies gold class
- [ ] Test: highlightCritical(1, 'd20') applies red class
- [ ] Test: highlightCritical(10, 'd20') applies no special class
- [ ] Test: animation doesn't block UI (non-blocking)
- [ ] Test: 20+ dice animation completes without jank

### CSS Animations (GPU Accelerated)
- [ ] Use transform and opacity only (GPU acceleration)
- [ ] Add will-change: transform hint for animated elements
- [ ] @keyframes roll-shake (shake effect)
- [ ] @keyframes number-cycle (number changing)
- [ ] @keyframes result-bounce (landing bounce)
- [ ] .critical-success (gold highlight + pulse)
- [ ] .critical-fail (red highlight + pulse)
- [ ] Smooth transitions (300ms)

### Implement animation.js
- [ ] Use requestAnimationFrame for number cycling (NOT setInterval)
- [ ] animateRoll(element) - trigger roll animation
- [ ] showNumberCycling(element, finalValue) - rAF-based cycling
- [ ] highlightCritical(value, diceType) - apply crit styling
- [ ] animateAllResults(results) - coordinate all dice animations
- [ ] Stagger animation for 20+ dice (50ms delay between each)

### Animation Flow
- [ ] Click Roll → disable button
- [ ] Shake animation (300ms)
- [ ] Number cycling via rAF (200ms)
- [ ] Land on final result (100ms)
- [ ] Apply critical highlights
- [ ] Re-enable button

### Performance Safeguards
- [ ] Avoid width/height changes during animation (no reflow)
- [ ] Use transform: scale() instead of size changes
- [ ] Handle tab inactive state (pause/resume animation)
- [ ] Stagger animation start for many dice

### Test: Phase 3 Verification
- [ ] Roll animation is smooth (no jank)
- [ ] 50 dice animation doesn't freeze browser
- [ ] d20=20 shows gold highlight
- [ ] d20=1 shows red highlight
- [ ] Animation completes < 1 second
- [ ] No layout shift during animation
- [ ] Rapid clicking handled (button disabled during roll)

---

## Phase 4: History & Presets (10 min)

### Write Tests First (js/storage.js)
- [ ] Test: saveRoll() adds to history
- [ ] Test: loadHistory() returns array
- [ ] Test: loadHistory() handles corrupted JSON gracefully
- [ ] Test: history max 20 items enforced
- [ ] Test: clearHistory() empties history
- [ ] Test: saveRoll() includes timestamp
- [ ] Test: LocalStorage quota exceeded error handled
- [ ] Test: works when LocalStorage unavailable

### Implement storage.js
- [ ] saveRoll(rollData) - save to LocalStorage with try-catch
- [ ] loadHistory() - retrieve with JSON parse error handling
- [ ] clearHistory() - remove all history
- [ ] getPresets() - get saved presets
- [ ] savePreset(name, diceConfig) - save custom preset
- [ ] removePreset(name) - delete preset
- [ ] isLocalStorageAvailable() - feature detection

### History Display
- [ ] Show last 20 rolls
- [ ] Format: "2d6+1d10 = 15"
- [ ] Show relative timestamp ("just now", "2 min ago")
- [ ] Click history item to re-roll same combination
- [ ] Clear History button works

### Quick Presets
- [ ] Attack Roll (1d20)
- [ ] Damage 2d6 (2d6)
- [ ] Stat Roll (4d6 drop lowest)
- [ ] Percentile (1d100)
- [ ] Click preset → set dice → auto roll

### Test: Phase 4 Verification
- [ ] Roll saves to history
- [ ] Refresh page → history loads
- [ ] Corrupted localStorage JSON → returns empty array, no crash
- [ ] 21st roll removes oldest
- [ ] Clear History removes all
- [ ] Click history item re-rolls
- [ ] Presets set correct dice
- [ ] LocalStorage full error handled gracefully

---

## Phase 5: Advanced Features (8 min)

### Coin Flip
- [ ] Flip Coin button
- [ ] 50/50 random (Heads/Tails)
- [ ] Flip animation
- [ ] Result display with icon
- [ ] Saves to history

### Advantage/Disadvantage (d20)
- [ ] Advantage button: roll 2d20, show both, highlight higher
- [ ] Disadvantage button: roll 2d20, show both, highlight lower
- [ ] Clear visual indication of which is used

### Modifiers
- [ ] Modifier input (+/- number)
- [ ] Apply to total
- [ ] Display: "2d6+3 = 10 (7+3)"

### Keyboard Shortcuts
- [ ] Space = Roll dice
- [ ] Enter = Roll dice
- [ ] Escape = Clear dice selection
- [ ] Prevent multiple rapid triggers (debounce)
- [ ] Ignore key repeat events

### Test: Phase 5 Verification
- [ ] Coin flip is 50/50 (100 flips, within ±10%)
- [ ] Advantage shows both d20, takes higher
- [ ] Disadvantage shows both d20, takes lower
- [ ] Modifier adds/subtracts correctly
- [ ] Space triggers roll
- [ ] Keyboard works on focused elements
- [ ] No duplicate rolls from key repeat (event.repeat check)

---

## Final Testing Checklist

### Random Distribution Test
```javascript
// Run in console to verify randomness
function testDistribution(sides, rolls) {
  const counts = {};
  for (let i = 1; i <= sides; i++) counts[i] = 0;
  for (let i = 0; i < rolls; i++) {
    const result = Math.floor(Math.random() * sides) + 1;
    counts[result]++;
  }
  const expected = rolls / sides;
  const tolerance = expected * 0.2; // ±20%
  let passed = true;
  for (let i = 1; i <= sides; i++) {
    const diff = Math.abs(counts[i] - expected);
    if (diff > tolerance) {
      console.warn(`Value ${i}: ${counts[i]} (expected ~${expected.toFixed(0)})`);
      passed = false;
    }
  }
  console.log(passed ? '✅ Distribution OK' : '❌ Distribution skewed');
  console.table(counts);
}
testDistribution(6, 1000);
testDistribution(20, 1000);
```

### Functional Tests
- [ ] All 6 dice types work (d4, d6, d8, d10, d12, d20)
- [ ] d10 returns 0-9 (zero-indexed)
- [ ] d100 returns 00-99 (percentile)
- [ ] Coin flip works
- [ ] Multiple dice roll correctly
- [ ] Total calculated accurately
- [ ] History saves and loads
- [ ] Animations smooth (60fps)

### Edge Cases
- [ ] Roll 0 dice → error message
- [ ] Roll 99 dice → works correctly (with staggered animation)
- [ ] Rapid clicking → no duplicate rolls
- [ ] LocalStorage full → graceful fallback (in-memory)
- [ ] LocalStorage corrupted JSON → graceful recovery
- [ ] Browser without LocalStorage → still works
- [ ] Tab inactive during animation → handles gracefully
- [ ] Same value rolled consecutively → displays correctly (not a bug)

### Mobile Testing
- [ ] Works on 320px viewport
- [ ] Works on landscape orientation
- [ ] Buttons 44px minimum
- [ ] Touch targets adequate
- [ ] :active state provides touch feedback
- [ ] No horizontal scroll
- [ ] Results scroll when many dice
- [ ] Animations smooth on mobile

---

## File Checklist

```
day3-dice-roller/
├── index.html          [x] Phase 1
├── js/
│   ├── app.js          [ ] Phase 2
│   ├── dice.js         [ ] Phase 2
│   ├── animation.js    [ ] Phase 3
│   └── storage.js      [ ] Phase 4
└── docs/
    ├── PRD.md          [x]
    ├── IMPLEMENTATION.md [x]
    └── PROMPTS-DAY3.md [ ]
```
