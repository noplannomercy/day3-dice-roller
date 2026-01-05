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

        // Modifier buttons
        document.getElementById('mod-increase').addEventListener('click', () => this.adjustModifier(1));
        document.getElementById('mod-decrease').addEventListener('click', () => this.adjustModifier(-1));

        // Coin flip button
        document.getElementById('flip-coin-btn').addEventListener('click', () => this.handleCoinFlip());

        // Advantage/Disadvantage buttons
        document.getElementById('advantage-btn').addEventListener('click', () => this.handleAdvantage());
        document.getElementById('disadvantage-btn').addEventListener('click', () => this.handleDisadvantage());

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
        // Reset modifier
        document.getElementById('modifier-input').value = '0';
    },

    /**
     * Adjust modifier value
     */
    adjustModifier(delta) {
        const input = document.getElementById('modifier-input');
        const current = parseInt(input.value) || 0;
        input.value = current + delta;
    },

    /**
     * Get current modifier value
     */
    getModifier() {
        const input = document.getElementById('modifier-input');
        return parseInt(input.value) || 0;
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
        const baseTotal = Dice.calculateTotal(results);
        const modifier = this.getModifier();
        const total = baseTotal + modifier;
        const diceString = Dice.formatSelection(this.diceConfig);

        // Format dice string with modifier
        let displayDice = diceString;
        if (modifier !== 0) {
            displayDice += modifier > 0 ? ` + ${modifier}` : ` - ${Math.abs(modifier)}`;
        }

        // Display results with animation
        await this.displayResultsAnimated(results, total, modifier, baseTotal);

        // Save to history
        Storage.saveRoll({
            dice: displayDice,
            results: results,
            total: modifier !== 0 ? `${total} (${baseTotal}${modifier > 0 ? '+' : ''}${modifier})` : total
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
    async displayResultsAnimated(results, total, modifier = 0, baseTotal = null) {
        const resultsSection = document.getElementById('results');
        const resultsList = document.getElementById('results-list');
        const totalEl = document.getElementById('total');

        // Show results section
        resultsSection.classList.remove('hidden');

        // Clear previous results
        resultsList.innerHTML = '';
        totalEl.textContent = '...';
        totalEl.classList.remove('text-yellow-500', 'text-red-500');

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

        // Animate total with modifier breakdown
        totalEl.classList.add('animate-bounce-in');
        if (modifier !== 0 && baseTotal !== null) {
            const modStr = modifier > 0 ? `+${modifier}` : `${modifier}`;
            totalEl.innerHTML = `${total} <span class="text-sm text-gray-500">(${baseTotal}${modStr})</span>`;
        } else {
            totalEl.textContent = total;
        }
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

        // Save to history
        Storage.saveRoll({
            dice: 'Coin Flip',
            results: { coin: [result] },
            total: result
        });
        this.loadAndDisplayHistory();

        // Remove animation class after completion
        setTimeout(() => {
            coinResultEl.classList.remove('animate-bounce-in');
        }, 400);
    },

    /**
     * Handle advantage roll (2d20, take higher)
     */
    async handleAdvantage() {
        if (this.isRolling) return;

        this.isRolling = true;
        const rollBtn = document.getElementById('roll-btn');
        rollBtn.disabled = true;

        // Roll 2d20
        const roll1 = Dice.rollDie(20);
        const roll2 = Dice.rollDie(20);
        const higher = Math.max(roll1, roll2);
        const lower = Math.min(roll1, roll2);

        // Display results
        await this.displayAdvantageResults(roll1, roll2, higher, 'Advantage');

        // Save to history
        Storage.saveRoll({
            dice: 'Advantage (2d20)',
            results: { d20: [roll1, roll2] },
            total: `${higher} (${roll1}, ${roll2})`
        });
        this.loadAndDisplayHistory();

        this.isRolling = false;
        rollBtn.disabled = false;
    },

    /**
     * Handle disadvantage roll (2d20, take lower)
     */
    async handleDisadvantage() {
        if (this.isRolling) return;

        this.isRolling = true;
        const rollBtn = document.getElementById('roll-btn');
        rollBtn.disabled = true;

        // Roll 2d20
        const roll1 = Dice.rollDie(20);
        const roll2 = Dice.rollDie(20);
        const higher = Math.max(roll1, roll2);
        const lower = Math.min(roll1, roll2);

        // Display results
        await this.displayAdvantageResults(roll1, roll2, lower, 'Disadvantage');

        // Save to history
        Storage.saveRoll({
            dice: 'Disadvantage (2d20)',
            results: { d20: [roll1, roll2] },
            total: `${lower} (${roll1}, ${roll2})`
        });
        this.loadAndDisplayHistory();

        this.isRolling = false;
        rollBtn.disabled = false;
    },

    /**
     * Display advantage/disadvantage results with highlighting
     */
    async displayAdvantageResults(roll1, roll2, selectedValue, type) {
        const resultsSection = document.getElementById('results');
        const resultsList = document.getElementById('results-list');
        const totalEl = document.getElementById('total');

        resultsSection.classList.remove('hidden');
        resultsList.innerHTML = '';

        const row = document.createElement('div');
        row.className = 'flex items-center gap-2 flex-wrap';

        const label = document.createElement('span');
        label.className = 'text-gray-600 font-medium w-16';
        label.textContent = `${type}:`;
        row.appendChild(label);

        // Create dice elements
        const die1 = Animation.createDiceElement(roll1, 'd20');
        const die2 = Animation.createDiceElement(roll2, 'd20');

        row.appendChild(die1);
        row.appendChild(die2);
        resultsList.appendChild(row);

        // Animate both dice
        await Promise.all([
            Animation.animateDieResult(die1, roll1, 'd20', 0),
            Animation.animateDieResult(die2, roll2, 'd20', 50)
        ]);

        // Highlight selected value, dim the other
        if (roll1 === selectedValue && roll1 !== roll2) {
            die2.classList.add('opacity-40');
        } else if (roll2 === selectedValue && roll1 !== roll2) {
            die1.classList.add('opacity-40');
        }

        // Show total with type indicator
        totalEl.classList.add('animate-bounce-in');
        totalEl.textContent = selectedValue;

        // Apply critical highlight to total if applicable
        if (selectedValue === 20) {
            totalEl.classList.add('text-yellow-500');
        } else if (selectedValue === 1) {
            totalEl.classList.add('text-red-500');
        } else {
            totalEl.classList.remove('text-yellow-500', 'text-red-500');
        }
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
