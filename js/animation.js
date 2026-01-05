/**
 * animation.js - Animation handling
 * Roll animations, critical highlights, number cycling using requestAnimationFrame
 */

const Animation = {
    // Animation timing constants
    SHAKE_DURATION: 300,
    CYCLE_DURATION: 200,
    CYCLE_INTERVAL: 50,
    STAGGER_DELAY: 50,
    BOUNCE_DURATION: 400,

    /**
     * Animate the roll button shake
     * @param {HTMLElement} button - The roll button element
     * @returns {Promise} Resolves when animation completes
     */
    shakeButton(button) {
        return new Promise(resolve => {
            button.classList.add('animate-shake');
            setTimeout(() => {
                button.classList.remove('animate-shake');
                resolve();
            }, this.SHAKE_DURATION);
        });
    },

    /**
     * Show number cycling effect using requestAnimationFrame
     * @param {HTMLElement} element - The element to animate
     * @param {number} finalValue - The final value to display
     * @param {number} maxValue - Maximum possible value for cycling
     * @param {boolean} zeroIndexed - Whether dice is zero-indexed (d10, d100)
     * @returns {Promise} Resolves when animation completes
     */
    showNumberCycling(element, finalValue, maxValue, zeroIndexed = false) {
        return new Promise(resolve => {
            const startTime = performance.now();
            const cycles = Math.floor(this.CYCLE_DURATION / this.CYCLE_INTERVAL);
            let currentCycle = 0;

            const animate = (timestamp) => {
                const elapsed = timestamp - startTime;

                if (elapsed < this.CYCLE_DURATION && currentCycle < cycles) {
                    // Show random number during cycling
                    const min = zeroIndexed ? 0 : 1;
                    const randomVal = Math.floor(Math.random() * maxValue) + min;
                    element.textContent = randomVal;
                    element.classList.add('animate-pop');

                    currentCycle++;
                    setTimeout(() => {
                        element.classList.remove('animate-pop');
                    }, this.CYCLE_INTERVAL - 10);

                    requestAnimationFrame(animate);
                } else {
                    // Show final value
                    element.textContent = finalValue;
                    element.classList.add('animate-bounce-in');
                    resolve();
                }
            };

            requestAnimationFrame(animate);
        });
    },

    /**
     * Apply critical hit/fail highlight
     * @param {HTMLElement} element - The dice result element
     * @param {number} value - The rolled value
     * @param {string} diceType - The type of dice (d20, etc.)
     */
    highlightCritical(element, value, diceType) {
        if (diceType !== 'd20') return;

        // Remove existing classes first
        element.classList.remove('critical-success', 'critical-fail');

        if (value === 20) {
            element.classList.add('critical-success');
        } else if (value === 1) {
            element.classList.add('critical-fail');
        }
    },

    /**
     * Animate a single dice result
     * @param {HTMLElement} element - The dice element
     * @param {number} value - The final value
     * @param {string} diceType - Type of dice
     * @param {number} delay - Stagger delay in ms
     * @returns {Promise} Resolves when animation completes
     */
    async animateDieResult(element, value, diceType, delay = 0) {
        // Wait for stagger delay
        if (delay > 0) {
            await new Promise(resolve => setTimeout(resolve, delay));
        }

        // Get max value and zero-indexed status
        const sides = parseInt(diceType.substring(1));
        const zeroIndexed = diceType === 'd10' || diceType === 'd100';
        const maxValue = zeroIndexed ? sides : sides;

        // Add GPU acceleration class
        element.classList.add('dice-result');

        // Run number cycling
        await this.showNumberCycling(element, value, maxValue, zeroIndexed);

        // Apply critical highlight if applicable
        this.highlightCritical(element, value, diceType);
    },

    /**
     * Animate all dice results with stagger effect
     * @param {NodeList|Array} elements - Array of dice elements
     * @param {Array} values - Array of values corresponding to elements
     * @param {string} diceType - Type of dice
     * @returns {Promise} Resolves when all animations complete
     */
    async animateAllDice(elements, values, diceType) {
        const animations = [];

        for (let i = 0; i < elements.length; i++) {
            const delay = i * this.STAGGER_DELAY;
            animations.push(
                this.animateDieResult(elements[i], values[i], diceType, delay)
            );
        }

        await Promise.all(animations);
    },

    /**
     * Animate coin flip
     * @param {HTMLElement} element - The coin result element
     * @param {string} result - 'Heads' or 'Tails'
     * @returns {Promise} Resolves when animation completes
     */
    animateCoinFlip(element) {
        return new Promise(resolve => {
            element.classList.add('animate-coin-flip');
            element.textContent = '...';

            setTimeout(() => {
                element.classList.remove('animate-coin-flip');
                resolve();
            }, 500);
        });
    },

    /**
     * Create animated dice element
     * @param {number} value - The dice value
     * @param {string} diceType - Type of dice
     * @returns {HTMLElement} The created element
     */
    createDiceElement(value, diceType) {
        const die = document.createElement('span');
        die.className = 'dice-result inline-flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg font-bold text-lg';
        die.textContent = '?';
        die.dataset.finalValue = value;
        die.dataset.diceType = diceType;
        return die;
    }
};

// ============================================
// ANIMATION TESTS - Run AnimationTests.runAll() in console
// ============================================
const AnimationTests = {
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

    testHighlightCritical() {
        console.log('\n--- Testing highlightCritical ---');

        // Create test element
        const el = document.createElement('span');

        // Test d20 = 20 (critical success)
        Animation.highlightCritical(el, 20, 'd20');
        this.assert(el.classList.contains('critical-success'), 'd20=20 gets critical-success class');

        // Reset
        el.classList.remove('critical-success', 'critical-fail');

        // Test d20 = 1 (critical fail)
        Animation.highlightCritical(el, 1, 'd20');
        this.assert(el.classList.contains('critical-fail'), 'd20=1 gets critical-fail class');

        // Reset
        el.classList.remove('critical-success', 'critical-fail');

        // Test d20 = 10 (no highlight)
        Animation.highlightCritical(el, 10, 'd20');
        this.assert(!el.classList.contains('critical-success') && !el.classList.contains('critical-fail'),
            'd20=10 gets no critical class');

        // Test d6 = 6 (no highlight - not d20)
        Animation.highlightCritical(el, 6, 'd6');
        this.assert(!el.classList.contains('critical-success'), 'd6=6 does not get critical class');
    },

    testTimingConstants() {
        console.log('\n--- Testing timing constants ---');

        this.assert(Animation.SHAKE_DURATION === 300, 'SHAKE_DURATION is 300ms');
        this.assert(Animation.CYCLE_DURATION === 200, 'CYCLE_DURATION is 200ms');
        this.assert(Animation.STAGGER_DELAY === 50, 'STAGGER_DELAY is 50ms');

        const totalTime = Animation.SHAKE_DURATION + Animation.CYCLE_DURATION + Animation.BOUNCE_DURATION;
        this.assert(totalTime < 1000, `Total animation time (${totalTime}ms) is under 1 second`);
    },

    testCreateDiceElement() {
        console.log('\n--- Testing createDiceElement ---');

        const el = Animation.createDiceElement(15, 'd20');
        this.assert(el.tagName === 'SPAN', 'Creates span element');
        this.assert(el.classList.contains('dice-result'), 'Has dice-result class');
        this.assert(el.dataset.finalValue === '15', 'Stores final value in dataset');
        this.assert(el.dataset.diceType === 'd20', 'Stores dice type in dataset');
    },

    async runAll() {
        console.log('🎬 Running Animation Tests...\n');
        this.passed = 0;
        this.failed = 0;

        this.testHighlightCritical();
        this.testTimingConstants();
        this.testCreateDiceElement();

        console.log(`\n${'='.repeat(40)}`);
        console.log(`Results: ${this.passed} passed, ${this.failed} failed`);
        console.log('='.repeat(40));

        return this.failed === 0;
    }
};
