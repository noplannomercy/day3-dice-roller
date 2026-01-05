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
        this.loadAndDisplayHistory();
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

        // Clear history button
        document.getElementById('clear-history').addEventListener('click', () => this.handleClearHistory());

        // Quick presets
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handlePreset(e));
        });

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
    async handleRoll() {
        if (this.isRolling) return;

        if (!this.hasDiceSelected()) {
            this.showMessage('Select at least one die to roll');
            return;
        }

        this.isRolling = true;
        const rollBtn = document.getElementById('roll-btn');
        rollBtn.disabled = true;
        rollBtn.textContent = 'Rolling...';

        // Shake animation on button
        await Animation.shakeButton(rollBtn);

        // Roll all dice
        const results = Dice.rollAll(this.diceConfig);
        const total = Dice.calculateTotal(results);
        const diceString = Dice.formatSelection(this.diceConfig);

        // Display results with animation
        await this.displayResultsAnimated(results, total);

        // Save to history
        Storage.saveRoll({
            dice: diceString,
            results: results,
            total: total
        });
        this.loadAndDisplayHistory();

        // Re-enable button
        this.isRolling = false;
        rollBtn.disabled = false;
        rollBtn.textContent = 'Roll Dice';
    },

    /**
     * Display roll results with animations
     */
    async displayResultsAnimated(results, total) {
        const resultsSection = document.getElementById('results');
        const resultsList = document.getElementById('results-list');
        const totalEl = document.getElementById('total');

        // Show results section
        resultsSection.classList.remove('hidden');

        // Clear previous results
        resultsList.innerHTML = '';
        totalEl.textContent = '...';

        // Collect all animations
        const allAnimations = [];
        let globalDelay = 0;

        // Add each dice type's results
        for (const [diceType, rolls] of Object.entries(results)) {
            const row = document.createElement('div');
            row.className = 'flex items-center gap-2 flex-wrap';

            const label = document.createElement('span');
            label.className = 'text-gray-600 font-medium w-12';
            label.textContent = `${diceType}:`;
            row.appendChild(label);

            // Add individual dice results with animation
            const diceElements = [];
            for (const value of rolls) {
                const die = Animation.createDiceElement(value, diceType);
                row.appendChild(die);
                diceElements.push({ element: die, value, diceType });
            }

            resultsList.appendChild(row);

            // Schedule animations with stagger
            for (const { element, value, diceType: dt } of diceElements) {
                allAnimations.push(
                    Animation.animateDieResult(element, value, dt, globalDelay)
                );
                globalDelay += Animation.STAGGER_DELAY;
            }
        }

        // Wait for all animations to complete
        await Promise.all(allAnimations);

        // Animate total
        totalEl.classList.add('animate-bounce-in');
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
    async handleCoinFlip() {
        const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
        const coinResultEl = document.getElementById('coin-result');

        // Animate coin flip
        await Animation.animateCoinFlip(coinResultEl);
        coinResultEl.textContent = result;
        coinResultEl.classList.add('animate-bounce-in');

        // Remove animation class after completion
        setTimeout(() => {
            coinResultEl.classList.remove('animate-bounce-in');
        }, 400);
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
    },

    /**
     * Load and display history from storage
     */
    loadAndDisplayHistory() {
        const historyList = document.getElementById('history-list');
        const history = Storage.loadHistory();

        if (history.length === 0) {
            historyList.innerHTML = '<p class="text-gray-400 italic">No rolls yet</p>';
            return;
        }

        historyList.innerHTML = '';

        for (const entry of history) {
            const item = document.createElement('div');
            item.className = 'flex items-center justify-between p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100 transition-colors';
            item.dataset.results = JSON.stringify(entry.results);

            const info = document.createElement('span');
            info.className = 'text-gray-700';
            info.textContent = `${entry.dice} = ${entry.total}`;

            const time = document.createElement('span');
            time.className = 'text-gray-400 text-xs';
            time.textContent = Storage.formatRelativeTime(entry.timestamp);

            item.appendChild(info);
            item.appendChild(time);

            // Click to re-roll
            item.addEventListener('click', () => this.rerollFromHistory(entry.results));

            historyList.appendChild(item);
        }
    },

    /**
     * Re-roll from history entry
     */
    async rerollFromHistory(results) {
        if (this.isRolling) return;

        // Reconstruct diceConfig from results
        this.clearAll();
        for (const [diceType, rolls] of Object.entries(results)) {
            this.diceConfig[diceType] = rolls.length;
            this.updateCountDisplay(diceType);
        }
        this.updateSelectionDisplay();

        // Trigger roll
        await this.handleRoll();
    },

    /**
     * Clear history
     */
    handleClearHistory() {
        Storage.clearHistory();
        this.loadAndDisplayHistory();
    },

    /**
     * Handle quick preset click
     */
    async handlePreset(e) {
        if (this.isRolling) return;

        const preset = e.currentTarget.dataset.preset;

        // Clear current selection
        this.clearAll();

        // Parse preset and set dice
        switch (preset) {
            case '1d20':
                this.diceConfig.d20 = 1;
                break;
            case '2d6':
                this.diceConfig.d6 = 2;
                break;
            case '4d6kh3':
                // 4d6 keep highest 3 (drop lowest)
                this.diceConfig.d6 = 4;
                break;
            case '1d100':
                this.diceConfig.d100 = 1;
                break;
        }

        // Update UI
        for (const diceType of Object.keys(this.diceConfig)) {
            this.updateCountDisplay(diceType);
        }
        this.updateSelectionDisplay();

        // Auto roll
        await this.handleRoll();
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => App.init());
