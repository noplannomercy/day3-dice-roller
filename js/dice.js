/**
 * dice.js - Dice rolling logic
 * Handles random generation, multiple dice, totals
 */

const Dice = {
    /**
     * Roll a single die with given number of sides
     * @param {number} sides - Number of sides (4, 6, 8, 12, 20)
     * @returns {number} Result from 1 to sides
     */
    rollDie(sides) {
        return Math.floor(Math.random() * sides) + 1;
    },

    /**
     * Roll a d10 (0-9, zero-indexed per PRD spec)
     * @returns {number} Result from 0 to 9
     */
    rollD10() {
        return Math.floor(Math.random() * 10);
    },

    /**
     * Roll a d100 (00-99, percentile per PRD spec)
     * @returns {number} Result from 0 to 99
     */
    rollD100() {
        return Math.floor(Math.random() * 100);
    },

    /**
     * Roll multiple dice of the same type
     * @param {number} count - Number of dice to roll
     * @param {string} diceType - Type of dice (d4, d6, d8, d10, d12, d20, d100)
     * @returns {number[]} Array of results
     */
    rollMultiple(count, diceType) {
        const results = [];
        const sides = parseInt(diceType.substring(1));

        for (let i = 0; i < count; i++) {
            if (diceType === 'd10') {
                results.push(this.rollD10());
            } else if (diceType === 'd100') {
                results.push(this.rollD100());
            } else {
                results.push(this.rollDie(sides));
            }
        }
        return results;
    },

    /**
     * Roll all dice based on configuration
     * @param {Object} diceConfig - Object with dice counts {d4: 0, d6: 2, ...}
     * @returns {Object} Results object {d6: [3, 5], d20: [17], ...}
     */
    rollAll(diceConfig) {
        const results = {};

        for (const [diceType, count] of Object.entries(diceConfig)) {
            if (count > 0) {
                results[diceType] = this.rollMultiple(count, diceType);
            }
        }
        return results;
    },

    /**
     * Calculate total from all dice results
     * @param {Object} results - Results object from rollAll
     * @returns {number} Sum of all dice
     */
    calculateTotal(results) {
        let total = 0;
        for (const rolls of Object.values(results)) {
            total += rolls.reduce((sum, val) => sum + val, 0);
        }
        return total;
    },

    /**
     * Format results for display
     * @param {Object} results - Results object from rollAll
     * @returns {string} Formatted string like "d6: [3, 5], d20: [17]"
     */
    formatResults(results) {
        const parts = [];
        for (const [diceType, rolls] of Object.entries(results)) {
            parts.push(`${diceType}: [${rolls.join(', ')}]`);
        }
        return parts.join(' | ');
    },

    /**
     * Format dice selection string
     * @param {Object} diceConfig - Object with dice counts
     * @returns {string} Formatted string like "2d6 + 1d20"
     */
    formatSelection(diceConfig) {
        const parts = [];
        const order = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100'];

        for (const diceType of order) {
            const count = diceConfig[diceType];
            if (count > 0) {
                parts.push(`${count}${diceType}`);
            }
        }
        return parts.length > 0 ? parts.join(' + ') : 'No dice selected';
    }
};

// ============================================
// TESTS - Run DiceTests.runAll() in console
// ============================================
const DiceTests = {
    passed: 0,
    failed: 0,

    assert(condition, testName) {
        if (condition) {
            this.passed++;
            console.log(`✅ ${testName}`);
        } else {
            this.failed++;
            console.error(`❌ ${testName}`);
        }
    },

    testRollDieRange() {
        console.log('\n--- Testing rollDie ranges ---');
        const testCases = [
            { sides: 4, min: 1, max: 4 },
            { sides: 6, min: 1, max: 6 },
            { sides: 8, min: 1, max: 8 },
            { sides: 12, min: 1, max: 12 },
            { sides: 20, min: 1, max: 20 }
        ];

        for (const { sides, min, max } of testCases) {
            let allInRange = true;
            for (let i = 0; i < 100; i++) {
                const result = Dice.rollDie(sides);
                if (result < min || result > max) {
                    allInRange = false;
                    break;
                }
            }
            this.assert(allInRange, `rollDie(${sides}) returns ${min}-${max}`);
        }
    },

    testD10Range() {
        console.log('\n--- Testing d10 (0-9) ---');
        let allInRange = true;
        const seen = new Set();

        for (let i = 0; i < 100; i++) {
            const result = Dice.rollD10();
            seen.add(result);
            if (result < 0 || result > 9) {
                allInRange = false;
                break;
            }
        }
        this.assert(allInRange, 'rollD10() returns 0-9 only');
        this.assert(seen.size >= 8, 'rollD10() produces varied results');
    },

    testD100Range() {
        console.log('\n--- Testing d100 (00-99) ---');
        let allInRange = true;
        let hasLow = false;
        let hasHigh = false;

        for (let i = 0; i < 200; i++) {
            const result = Dice.rollD100();
            if (result < 0 || result > 99) {
                allInRange = false;
                break;
            }
            if (result < 10) hasLow = true;
            if (result > 89) hasHigh = true;
        }
        this.assert(allInRange, 'rollD100() returns 00-99 only');
        this.assert(hasLow && hasHigh, 'rollD100() produces low and high values');
    },

    testDistribution() {
        console.log('\n--- Testing distribution (1000 rolls) ---');

        // Test d6 distribution
        const d6Counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
        for (let i = 0; i < 1000; i++) {
            d6Counts[Dice.rollDie(6)]++;
        }
        const d6Expected = 1000 / 6;
        const d6Tolerance = d6Expected * 0.25; // 25% tolerance for 1000 rolls
        let d6Pass = true;
        for (let val = 1; val <= 6; val++) {
            if (Math.abs(d6Counts[val] - d6Expected) > d6Tolerance) {
                d6Pass = false;
            }
        }
        this.assert(d6Pass, `d6 distribution within ±25% (expected ~${Math.round(d6Expected)})`);
        console.table(d6Counts);

        // Test d20 distribution
        const d20Counts = {};
        for (let i = 1; i <= 20; i++) d20Counts[i] = 0;
        for (let i = 0; i < 1000; i++) {
            d20Counts[Dice.rollDie(20)]++;
        }
        const d20Expected = 1000 / 20;
        const d20Tolerance = d20Expected * 0.35; // 35% tolerance for d20
        let d20Pass = true;
        for (let val = 1; val <= 20; val++) {
            if (Math.abs(d20Counts[val] - d20Expected) > d20Tolerance) {
                d20Pass = false;
            }
        }
        this.assert(d20Pass, `d20 distribution within ±35% (expected ~${Math.round(d20Expected)})`);
    },

    testRollMultiple() {
        console.log('\n--- Testing rollMultiple ---');

        const results3d6 = Dice.rollMultiple(3, 'd6');
        this.assert(results3d6.length === 3, 'rollMultiple(3, d6) returns 3 results');
        this.assert(results3d6.every(r => r >= 1 && r <= 6), '3d6 all values in range');

        const results5d20 = Dice.rollMultiple(5, 'd20');
        this.assert(results5d20.length === 5, 'rollMultiple(5, d20) returns 5 results');

        const results2d10 = Dice.rollMultiple(2, 'd10');
        this.assert(results2d10.every(r => r >= 0 && r <= 9), '2d10 all values 0-9');
    },

    testCalculateTotal() {
        console.log('\n--- Testing calculateTotal ---');

        const results1 = { d6: [3, 4], d10: [7] };
        this.assert(Dice.calculateTotal(results1) === 14, 'calculateTotal({d6:[3,4], d10:[7]}) = 14');

        const results2 = { d20: [20] };
        this.assert(Dice.calculateTotal(results2) === 20, 'calculateTotal({d20:[20]}) = 20');

        const results3 = {};
        this.assert(Dice.calculateTotal(results3) === 0, 'calculateTotal({}) = 0');
    },

    testFormatSelection() {
        console.log('\n--- Testing formatSelection ---');

        const config1 = { d4: 0, d6: 2, d8: 0, d10: 1, d12: 0, d20: 1, d100: 0 };
        this.assert(
            Dice.formatSelection(config1) === '2d6 + 1d10 + 1d20',
            'formatSelection shows "2d6 + 1d10 + 1d20"'
        );

        const config2 = { d4: 0, d6: 0, d8: 0, d10: 0, d12: 0, d20: 0, d100: 0 };
        this.assert(
            Dice.formatSelection(config2) === 'No dice selected',
            'formatSelection shows "No dice selected" when empty'
        );
    },

    runAll() {
        console.log('🎲 Running Dice.js Tests...\n');
        this.passed = 0;
        this.failed = 0;

        this.testRollDieRange();
        this.testD10Range();
        this.testD100Range();
        this.testDistribution();
        this.testRollMultiple();
        this.testCalculateTotal();
        this.testFormatSelection();

        console.log(`\n${'='.repeat(40)}`);
        console.log(`Results: ${this.passed} passed, ${this.failed} failed`);
        console.log('='.repeat(40));

        return this.failed === 0;
    }
};
