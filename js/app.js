/**
 * app.js - Main application logic
 * Coordinates dice selection, rolling, and UI updates
 */

const App = {
    // Dice count state
    diceConfig: {
        d4: 0,
        d6: 0,
        d8: 0,
        d10: 0,
        d12: 0,
        d20: 0,
        d100: 0
    },

    // Rolling state (prevent rapid clicks)
    isRolling: false,

    /**
     * Initialize the application
     */
    init() {
        this.bindEvents();
        this.updateSelectionDisplay();
        console.log('🎲 Dice Roller initialized. Run DiceTests.runAll() to test.');
    },

    /**
     * Bind all event listeners
     */
    bindEvents() {
        // Dice +/- buttons
        document.querySelectorAll('[data-dice]').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleDiceButton(e));
        });

        // Roll button
        document.getElementById('roll-btn').addEventListener('click', () => this.handleRoll());

        // Clear all button
        document.getElementById('clear-all').addEventListener('click', () => this.clearAll());

        // Coin flip button
        document.getElementById('flip-coin-btn').addEventListener('click', () => this.handleCoinFlip());

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    },

    /**
     * Handle dice +/- button clicks
     */
    handleDiceButton(e) {
        const btn = e.currentTarget;
        const diceType = btn.dataset.dice;
        const action = btn.dataset.action;

        if (action === 'increase' && this.diceConfig[diceType] < 99) {
            this.diceConfig[diceType]++;
        } else if (action === 'decrease' && this.diceConfig[diceType] > 0) {
            this.diceConfig[diceType]--;
        }

        this.updateCountDisplay(diceType);
        this.updateSelectionDisplay();
    },

    /**
     * Update individual dice count display
     */
    updateCountDisplay(diceType) {
        const countEl = document.getElementById(`count-${diceType}`);
        if (countEl) {
            countEl.textContent = this.diceConfig[diceType];
        }
    },

    /**
     * Update the current selection display
     */
    updateSelectionDisplay() {
        const selectionEl = document.getElementById('current-selection');
        if (selectionEl) {
            selectionEl.textContent = Dice.formatSelection(this.diceConfig);
        }
    },

    /**
     * Clear all dice counts
     */
    clearAll() {
        for (const diceType of Object.keys(this.diceConfig)) {
            this.diceConfig[diceType] = 0;
            this.updateCountDisplay(diceType);
        }
        this.updateSelectionDisplay();
    },

    /**
     * Check if any dice are selected
     */
    hasDiceSelected() {
        return Object.values(this.diceConfig).some(count => count > 0);
    },

    /**
     * Handle roll button click
     */
    handleRoll() {
        if (this.isRolling) return;

        if (!this.hasDiceSelected()) {
            this.showMessage('Select at least one die to roll');
            return;
        }

        this.isRolling = true;
        const rollBtn = document.getElementById('roll-btn');
        rollBtn.disabled = true;
        rollBtn.textContent = 'Rolling...';

        // Roll all dice
        const results = Dice.rollAll(this.diceConfig);
        const total = Dice.calculateTotal(results);

        // Display results (animation will be added in Phase 3)
        this.displayResults(results, total);

        // Re-enable button
        setTimeout(() => {
            this.isRolling = false;
            rollBtn.disabled = false;
            rollBtn.textContent = 'Roll Dice';
        }, 300);
    },

    /**
     * Display roll results
     */
    displayResults(results, total) {
        const resultsSection = document.getElementById('results');
        const resultsList = document.getElementById('results-list');
        const totalEl = document.getElementById('total');

        // Show results section
        resultsSection.classList.remove('hidden');

        // Clear previous results
        resultsList.innerHTML = '';

        // Add each dice type's results
        for (const [diceType, rolls] of Object.entries(results)) {
            const row = document.createElement('div');
            row.className = 'flex items-center gap-2 flex-wrap';

            const label = document.createElement('span');
            label.className = 'text-gray-600 font-medium w-12';
            label.textContent = `${diceType}:`;
            row.appendChild(label);

            // Add individual dice results
            for (const value of rolls) {
                const die = document.createElement('span');
                die.className = 'inline-flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg font-bold text-lg';

                // Check for critical hits/fails on d20
                if (diceType === 'd20') {
                    if (value === 20) {
                        die.classList.remove('bg-gray-100');
                        die.classList.add('bg-yellow-400', 'text-yellow-900');
                    } else if (value === 1) {
                        die.classList.remove('bg-gray-100');
                        die.classList.add('bg-red-500', 'text-white');
                    }
                }

                die.textContent = value;
                row.appendChild(die);
            }

            resultsList.appendChild(row);
        }

        // Update total
        totalEl.textContent = total;
    },

    /**
     * Show a temporary message
     */
    showMessage(message) {
        const resultsSection = document.getElementById('results');
        const resultsList = document.getElementById('results-list');

        resultsSection.classList.remove('hidden');
        resultsList.innerHTML = `<p class="text-gray-500 italic">${message}</p>`;
        document.getElementById('total').textContent = '—';
    },

    /**
     * Handle coin flip
     */
    handleCoinFlip() {
        const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
        const coinResultEl = document.getElementById('coin-result');

        // Simple animation
        coinResultEl.textContent = '...';
        setTimeout(() => {
            coinResultEl.textContent = result;
        }, 200);
    },

    /**
     * Handle keyboard shortcuts
     */
    handleKeyboard(e) {
        // Ignore if typing in an input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        // Ignore key repeats
        if (e.repeat) return;

        if (e.code === 'Space' || e.code === 'Enter') {
            e.preventDefault();
            this.handleRoll();
        } else if (e.code === 'Escape') {
            e.preventDefault();
            this.clearAll();
        }
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => App.init());
