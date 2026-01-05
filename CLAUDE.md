# Dice Roller & Coin Flipper

## Tech Stack
- HTML5, Tailwind CSS (CDN), Vanilla JavaScript (ES6+)
- LocalStorage API for persistence
- Modular JS: app.js, dice.js, animation.js, storage.js
- No build tools, no external dependencies

## Commands
- **Open:** `open index.html`
- **Test:** Browser console + manual dice testing (100 rolls)

## Development Workflow
CRITICAL: Follow strict TODO workflow:
1. Create detailed todo list FIRST
2. Show list - STOP
3. Get approval
4. Execute FIRST task only
5. STOP after task - show result
6. Wait for "continue" before next task

DO NOT proceed without approval. DO NOT skip todo list.

Use THINK HARDER for: Animation design, random distribution logic, performance optimization.

## Git Workflow
**Branches:** `feature/[name]`, `fix/[name]`
**Commits:** `feat:`, `fix:`, `test:` prefix

YOU MUST before ANY commit:
- Test all dice types (d4-d20)
- Verify random distribution (100 rolls)
- Check animations smooth
- No console errors

## Testing Requirements
ALWAYS write tests FIRST for:
- Random generation: d4-d20 even distribution, no predictable patterns
- Multiple dice: 3d6 = 3 individual results, total accuracy
- Critical highlights: d20=1 (red), d20=20 (gold)
- History: save, load, clear, max 20 items
- LocalStorage: error handling (quota exceeded, try-catch)
- Animations: smooth 60fps, no layout shift

Test each component independently:
- `dice.js` - random logic, dice calculations
- `animation.js` - visual effects, CSS transitions
- `storage.js` - LocalStorage operations

NEVER skip writing tests. NEVER use predictable random (Date.now()). NEVER commit failing tests.

## Code Conventions
- Tailwind utility classes ONLY (no inline styles)
- Modular JS files (app.js, dice.js, animation.js, storage.js)
- Semantic HTML elements
- Smooth animations (300ms roll, 60fps)
- Comment complex logic only

## Critical Rules
**IMPORTANT:** Random generation MUST be truly random. All dice MUST show individual results. Criticals (d20=1,20) MUST be highlighted. History MUST persist. Animations MUST be smooth 60fps.

**YOU MUST:** Validate dice counts (1-99). Test random distribution (1000 rolls). Show clear visual feedback. Handle rapid clicking gracefully. Support keyboard controls (Space=roll).

**NEVER:** Use predictable random. Skip individual dice results. Use slow animations. Store unlimited history. Make tiny tap targets.

**ALWAYS:** Show each die result clearly. Animate roll action. Highlight d20 criticals. Provide instant feedback. Test on mobile (320px+, 44px min buttons).
