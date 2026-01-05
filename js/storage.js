/**
 * storage.js - LocalStorage operations
 * History save/load, presets management
 */

const Storage = {
    HISTORY_KEY: 'diceroller_history',
    PRESETS_KEY: 'diceroller_presets',
    MAX_HISTORY: 20,

    /**
     * Check if localStorage is available
     * @returns {boolean}
     */
    isLocalStorageAvailable() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    },

    /**
     * Save a roll to history
     * @param {Object} rollData - { dice, results, total }
     */
    saveRoll(rollData) {
        if (!this.isLocalStorageAvailable()) return;

        try {
            const history = this.loadHistory();

            const entry = {
                dice: rollData.dice,
                results: rollData.results,
                total: rollData.total,
                timestamp: new Date().toISOString()
            };

            // Add to beginning
            history.unshift(entry);

            // Enforce max limit
            if (history.length > this.MAX_HISTORY) {
                history.pop();
            }

            localStorage.setItem(this.HISTORY_KEY, JSON.stringify(history));
        } catch (e) {
            console.warn('Failed to save roll to history:', e);
        }
    },

    /**
     * Load history from localStorage
     * @returns {Array} History array
     */
    loadHistory() {
        if (!this.isLocalStorageAvailable()) return [];

        try {
            const data = localStorage.getItem(this.HISTORY_KEY);
            if (!data) return [];

            const parsed = JSON.parse(data);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            console.warn('Failed to load history (corrupted JSON?):', e);
            // Clear corrupted data
            this.clearHistory();
            return [];
        }
    },

    /**
     * Clear all history
     */
    clearHistory() {
        if (!this.isLocalStorageAvailable()) return;

        try {
            localStorage.removeItem(this.HISTORY_KEY);
        } catch (e) {
            console.warn('Failed to clear history:', e);
        }
    },

    /**
     * Format relative timestamp
     * @param {string} isoString - ISO timestamp
     * @returns {string} Relative time string
     */
    formatRelativeTime(isoString) {
        const now = new Date();
        const then = new Date(isoString);
        const diffMs = now - then;
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHour = Math.floor(diffMin / 60);

        if (diffSec < 10) return 'just now';
        if (diffSec < 60) return `${diffSec}s ago`;
        if (diffMin < 60) return `${diffMin}m ago`;
        if (diffHour < 24) return `${diffHour}h ago`;
        return then.toLocaleDateString();
    },

    /**
     * Save a custom preset
     * @param {string} name - Preset name
     * @param {Object} diceConfig - Dice configuration
     */
    savePreset(name, diceConfig) {
        if (!this.isLocalStorageAvailable()) return;

        try {
            const presets = this.loadPresets();
            presets[name] = diceConfig;
            localStorage.setItem(this.PRESETS_KEY, JSON.stringify(presets));
        } catch (e) {
            console.warn('Failed to save preset:', e);
        }
    },

    /**
     * Load custom presets
     * @returns {Object} Presets object
     */
    loadPresets() {
        if (!this.isLocalStorageAvailable()) return {};

        try {
            const data = localStorage.getItem(this.PRESETS_KEY);
            if (!data) return {};

            const parsed = JSON.parse(data);
            return typeof parsed === 'object' && parsed !== null ? parsed : {};
        } catch (e) {
            console.warn('Failed to load presets:', e);
            return {};
        }
    },

    /**
     * Remove a custom preset
     * @param {string} name - Preset name
     */
    removePreset(name) {
        if (!this.isLocalStorageAvailable()) return;

        try {
            const presets = this.loadPresets();
            delete presets[name];
            localStorage.setItem(this.PRESETS_KEY, JSON.stringify(presets));
        } catch (e) {
            console.warn('Failed to remove preset:', e);
        }
    }
};

// ============================================
// STORAGE TESTS - Run StorageTests.runAll() in console
// ============================================
const StorageTests = {
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

    testLocalStorageAvailable() {
        console.log('\n--- Testing localStorage availability ---');
        const available = Storage.isLocalStorageAvailable();
        this.assert(typeof available === 'boolean', 'isLocalStorageAvailable returns boolean');
        console.log(`LocalStorage available: ${available}`);
    },

    testSaveAndLoadHistory() {
        console.log('\n--- Testing save and load history ---');

        // Clear first
        Storage.clearHistory();

        // Save a roll
        const testRoll = {
            dice: '2d6 + 1d20',
            results: { d6: [3, 5], d20: [15] },
            total: 23
        };
        Storage.saveRoll(testRoll);

        // Load and verify
        const history = Storage.loadHistory();
        this.assert(Array.isArray(history), 'loadHistory returns array');
        this.assert(history.length === 1, 'History has 1 entry');
        this.assert(history[0].total === 23, 'Saved total is correct');
        this.assert(history[0].dice === '2d6 + 1d20', 'Saved dice string is correct');
        this.assert(history[0].timestamp !== undefined, 'Entry has timestamp');
    },

    testMaxHistoryLimit() {
        console.log('\n--- Testing max history limit (20) ---');

        // Clear first
        Storage.clearHistory();

        // Add 25 items
        for (let i = 1; i <= 25; i++) {
            Storage.saveRoll({
                dice: `roll ${i}`,
                results: {},
                total: i
            });
        }

        const history = Storage.loadHistory();
        this.assert(history.length === 20, `History limited to 20 (got ${history.length})`);
        this.assert(history[0].total === 25, 'Most recent (25) is first');
        this.assert(history[19].total === 6, 'Oldest kept (6) is last');
    },

    testClearHistory() {
        console.log('\n--- Testing clear history ---');

        Storage.saveRoll({ dice: 'test', results: {}, total: 1 });
        Storage.clearHistory();

        const history = Storage.loadHistory();
        this.assert(history.length === 0, 'History is empty after clear');
    },

    testCorruptedJSON() {
        console.log('\n--- Testing corrupted JSON handling ---');

        if (Storage.isLocalStorageAvailable()) {
            // Manually set corrupted data
            localStorage.setItem(Storage.HISTORY_KEY, 'not valid json{{{');

            // Should return empty array and not crash
            const history = Storage.loadHistory();
            this.assert(Array.isArray(history), 'Returns array for corrupted JSON');
            this.assert(history.length === 0, 'Returns empty array for corrupted JSON');
        } else {
            console.log('Skipping (localStorage not available)');
        }
    },

    testRelativeTime() {
        console.log('\n--- Testing relative time formatting ---');

        const now = new Date();
        const justNow = new Date(now - 5000).toISOString();
        const minAgo = new Date(now - 120000).toISOString();
        const hourAgo = new Date(now - 3600000).toISOString();

        this.assert(Storage.formatRelativeTime(justNow) === 'just now', 'Just now formatting');
        this.assert(Storage.formatRelativeTime(minAgo).includes('m ago'), 'Minutes ago formatting');
        this.assert(Storage.formatRelativeTime(hourAgo).includes('h ago'), 'Hours ago formatting');
    },

    runAll() {
        console.log('💾 Running Storage Tests...\n');
        this.passed = 0;
        this.failed = 0;

        this.testLocalStorageAvailable();
        this.testSaveAndLoadHistory();
        this.testMaxHistoryLimit();
        this.testClearHistory();
        this.testCorruptedJSON();
        this.testRelativeTime();

        // Clean up
        Storage.clearHistory();

        console.log(`\n${'='.repeat(40)}`);
        console.log(`Results: ${this.passed} passed, ${this.failed} failed`);
        console.log('='.repeat(40));

        return this.failed === 0;
    }
};
