# 🎲 Arcane Roller - Digital Dice Roller

A fantasy RPG-themed digital dice roller with an authentic D&D aesthetic. Perfect for tabletop RPG players, board gamers, and anyone who needs a beautiful dice rolling companion.

![Fantasy RPG Design](https://img.shields.io/badge/Design-Fantasy%20RPG-gold)
![Vanilla JS](https://img.shields.io/badge/JavaScript-Vanilla-yellow)
![No Dependencies](https://img.shields.io/badge/Dependencies-None-green)

## ✨ Features

### 🎯 Core Functionality
- **Multiple Dice Types**: d4, d6, d8, d10, d12, d20, d100
- **Bulk Rolling**: Roll up to 99 dice of each type simultaneously
- **Modifiers**: Add positive or negative modifiers to rolls
- **Individual Results**: See each die result clearly displayed
- **Total Calculation**: Automatic sum with modifier breakdown

### 🎮 Advanced Features
- **Advantage/Disadvantage**: D&D 5e style advantage and disadvantage rolls
- **Critical Highlights**: Natural 1s (red) and 20s (gold) automatically highlighted
- **Roll History**: Persistent history with timestamps (LocalStorage)
- **Quick Presets**: One-click common rolls (1d20, 2d6, 4d6 drop lowest, 1d100)
- **Coin Flip**: Digital coin flipper with animation
- **Keyboard Shortcuts**: Space bar to roll

### 🎨 Design
- **Fantasy RPG Aesthetic**: Medieval fantasy theme inspired by D&D character sheets
- **Parchment & Leather**: Aged paper and leather textures
- **Gold & Bronze**: Authentic medieval color palette
- **Smooth Animations**: GPU-accelerated animations at 60fps
- **Responsive**: Works on mobile (320px+) and desktop
- **Dark Theme**: Easy on the eyes for long gaming sessions

## 🚀 Quick Start

### Installation

No build process required! Just open the HTML file:

```bash
# Clone or download the project
git clone <repository-url>
cd day3-dice-roller

# Open in browser
open index.html
# or on Windows
start index.html
```

### Usage

1. **Select Dice**: Click + buttons to add dice (d4-d100)
2. **Add Modifier**: Adjust the modifier if needed
3. **Roll**: Click the big bronze "ROLL DICE" button
4. **View Results**: See individual dice and total with animations
5. **History**: Previous rolls saved automatically

**Quick Presets**:
- Click preset buttons for instant common rolls
- 1d20 (ability checks), 2d6 (stats), 4d6 drop low (character creation)

**Advantage/Disadvantage**:
- Click Advantage/Disadvantage buttons for D&D 5e rolls
- Automatically rolls 2d20 and selects higher/lower

**Keyboard**:
- Press `Space` to roll dice

## 📁 Project Structure

```
day3-dice-roller/
├── index.html              # Main HTML file (includes all UI)
├── js/
│   ├── app.js              # Application logic & state management
│   ├── dice.js             # Dice rolling & random generation
│   ├── animation.js        # Animation system (60fps)
│   └── storage.js          # LocalStorage persistence
├── docs/
│   ├── DESIGN.md           # Design system documentation
│   ├── PROMPTS-DAY3.md     # Development prompts log
│   └── PROMPTS-STITCH.md   # Stitch AI generation prompts
├── CLAUDE.md               # Development workflow guide
└── README.md               # This file
```

## 🛠️ Technology Stack

**Frontend**
- HTML5 semantic markup
- Tailwind CSS v3 (CDN) - Utility-first styling
- Vanilla JavaScript (ES6+) - No frameworks
- Google Fonts (Newsreader) - Fantasy serif typeface
- Material Symbols - Icon library

**Features**
- LocalStorage API - Persistent history
- requestAnimationFrame - Smooth animations
- Crypto.getRandomValues() - True random number generation
- GPU Acceleration - transform3d for performance

**No Build Tools**
- No npm, webpack, or bundlers
- No external dependencies
- Works offline (except CDN fonts/icons)

## 🎲 How It Works

### Random Generation

Uses `Crypto.getRandomValues()` for cryptographically secure random numbers:

```javascript
// dice.js - True random generation
rollDice(sides, count) {
    const results = [];
    const array = new Uint32Array(count);
    crypto.getRandomValues(array);

    for (let i = 0; i < count; i++) {
        results.push((array[i] % sides) + 1);
    }
    return results;
}
```

**Why not Math.random()?**
- Math.random() can be predictable
- Crypto API provides true randomness
- Critical for fair dice rolls

### Animation System

60fps animations using requestAnimationFrame:

1. **Shake**: Roll button shakes when clicked (300ms)
2. **Cycle**: Numbers cycle rapidly before final value (200ms)
3. **Bounce**: Results bounce in with scale effect (400ms)
4. **Stagger**: Multiple dice animate sequentially (50ms delay)
5. **Critical**: Pulse animation for natural 1/20 (600ms)

### State Management

Simple object-based state in `app.js`:

```javascript
const App = {
    diceConfig: { d4: 0, d6: 0, d8: 0, ... },
    isRolling: false,
    // ... methods
}
```

### Persistence

Roll history stored in LocalStorage:
- Max 20 entries (FIFO)
- Timestamps in relative format (just now, 2 mins ago)
- Survives page refresh

## 🧪 Testing

### Manual Testing

Open browser console and run:

```javascript
// Test dice generation (1000 rolls)
DiceTests.runAll()

// Test animations
AnimationTests.runAll()

// Test storage
StorageTests.runAll()
```

### Distribution Test

Verify random distribution is even:

```javascript
// Roll d6 1000 times
DiceTests.testD6Distribution()
// Should show ~166-167 of each number (1-6)
```

### Critical Highlights

```javascript
// Test d20 critical highlighting
DiceTests.testD20Criticals()
// Natural 1 should be red, Natural 20 should be gold
```

## 🎨 Design System

Full design documentation in `docs/DESIGN.md`.

### Color Palette

```css
--primary: #f2cc0d           /* Gold */
--background-dark: #221f10   /* Dark brown */
--bronze: #8b5e3c            /* Bronze/copper */
--parchment: #f4e4bc         /* Aged paper */
```

### Typography

```css
font-family: "Newsreader", serif;  /* Medieval fantasy */
```

### Component Patterns

- **Dice Buttons**: Icon + label, hover scale, active glow
- **Roll Button**: Bronze gradient, embossed effect
- **Results**: Double border frame, centered giant number
- **History**: Parchment texture, divided entries

## 🔧 Development

### Workflow (CLAUDE.md)

**CRITICAL**: Follow strict TODO workflow:

1. Create detailed todo list FIRST
2. Show list - STOP
3. Get approval
4. Execute FIRST task only
5. STOP after task - show result
6. Wait for "continue" before next task

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-dice-type

# Make changes...

# Commit with conventional commits
git commit -m "feat: add d30 dice type"
git commit -m "fix: critical highlight timing"
git commit -m "test: add d30 distribution test"
```

### Testing Requirements

**ALWAYS test before commit:**
- ✅ All dice types (d4-d20) work
- ✅ Random distribution is even (100+ rolls)
- ✅ Animations smooth (no jank)
- ✅ Critical highlights (d20=1 red, d20=20 gold)
- ✅ History saves/loads
- ✅ No console errors

### Code Conventions

- Tailwind utility classes ONLY (no inline styles)
- Modular JS files (separation of concerns)
- Semantic HTML5 elements
- Comment complex logic only
- 300ms max animation duration
- Touch targets minimum 44x44px

## 📱 Browser Support

- Chrome/Edge 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Mobile browsers ✅

**Requirements:**
- CSS Grid support
- requestAnimationFrame
- Crypto.getRandomValues()
- LocalStorage

## 🎯 Roadmap

### Planned Features
- [ ] Custom dice notation parser (3d6+2, 4d6kh3)
- [ ] Dice pool builder (Shadowrun, World of Darkness)
- [ ] Sound effects (dice rolling sounds)
- [ ] 3D dice animation (CSS 3D transforms)
- [ ] Share roll results (copy to clipboard)
- [ ] Dark/Light theme toggle
- [ ] Custom color schemes
- [ ] Export history as CSV

### Potential Enhancements
- Dice probability calculator
- Success/failure counting (target numbers)
- Reroll mechanics
- Exploding dice
- Import/export presets

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create feature branch (`feature/amazing-feature`)
3. Follow code conventions
4. Test thoroughly (run all tests)
5. Commit with conventional commits
6. Open Pull Request

**Code Style:**
- Use Tailwind utilities
- Keep JavaScript modular
- Add tests for new features
- Update documentation

## 📄 License

MIT License - feel free to use for personal or commercial projects.

## 🙏 Credits

**Design Inspiration:**
- D&D 5e Character Sheets
- Roll20
- Fantasy Grounds

**Generated with:**
- Google Stitch AI (initial design)
- Claude Code (development)

**Fonts & Icons:**
- Google Fonts (Newsreader)
- Material Symbols

## 📞 Support

Issues? Questions?
- Check `docs/DESIGN.md` for design details
- Check `CLAUDE.md` for development workflow
- Run tests in browser console
- Open an issue on GitHub

---

**Built for epic adventures.** 🗡️✨

May your rolls be high and your criticals plentiful!
