const CONFIG = {
    MAX_DIGITS: 9,
    DEFAULT_VALUE: '0',
    DECIMAL_SEPARATOR: '.',
    PRECISION: 9,
    MAX_NUMBER = 999999999,
};

const NUMBERS = {
    zero: 0,
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    dot: CONFIG.DECIMAL_SEPARATOR
};

const OPERATORS = {
    ADD: 'add',
    SUBTRACT: 'subtract',
    MULTIPLY: 'multiply',
    DIVIDE: 'divide'
};

class Calculator {
    constructor(display, keyboard) {
        this.display = display;
        this.keyboard = keyboard;
        this.store = {
            digitCount: 0,
            isTypingNewNumber: true,
            hasDecimal: false,
            previousValue: null,
            currentValue: 0,
            currentOperation: null
        };

        this.initialize();
    }

    initialize() {
        this.resetDisplay();
        this.keyboard.addEventListener('click', e => this.handleKeyboardClick(e));
    }

    resetDisplay() {
        this.display.textContent = CONFIG.DEFAULT_VALUE;
        Object.assign(this.store, {
            digitCount: 0,
            isTypingNewNumber: true,
            hasDecimal: false,
            previousValue: null,
            currentValue: 0,
            currentOperation: null
        });
    }

    handleKeyboardClick(event) {
        const target = event.target;
        if (target.classList.contains('digit')) {
            try {
                this.handleDigitInput(target.id);
            } catch (error) {
                console.error('Error:', error);
                this.resetDisplay();
            }
        }
        if (target.id === 'clear') {
            this.resetDisplay();
        }

        if (target.classList.contains('operator')) {
            if (!!this.store.currentOperation && !this.store.isTypingNewNumber) {
                this.store.currentValue = parseFloat(this.display.textContent);
                this.executeOperation();
            }
            this.store.previousValue =  parseFloat(this.display.textContent);
            this.store.currentOperation = target.id ?? null;
            this.store.isTypingNewNumber = true;
            this.store.digitCount = 0;

        }

        if(target.classList.contains('equals')) {
            if (!!this.store.currentOperation && !this.store.isTypingNewNumber) {
                this.store.currentValue = parseFloat(this.display.textContent);
                this.executeOperation();
            }
            this.store.previousValue =  parseFloat(this.display.textContent);
            this.store.currentOperation = null;
            this.store.isTypingNewNumber = true;
            this.store.digitCount = 0;
        }
    }

    handleDigitInput(digit) {
        // Early return if max digits reached
        if (this.store.digitCount >= CONFIG.MAX_DIGITS) {
            return;
        }

        // Validate input
        if (!NUMBERS.hasOwnProperty(digit)) {
            throw new Error(`Invalid digit input: ${digit}`);
        }

        const isDot = digit === 'dot';
        const numberToAdd = NUMBERS[digit];

        // Handle decimal point
        if (isDot) {
            if (this.store.hasDecimal) {
                return; // Ignore additional decimal points
            }

            this.display.textContent = this.store.isTypingNewNumber
                ? `0${CONFIG.DECIMAL_SEPARATOR}`
                : `${this.display.textContent}${CONFIG.DECIMAL_SEPARATOR}`;

            this.store.hasDecimal = true;
            this.store.digitCount++;
            this.store.isTypingNewNumber = false;
            return;
        }

        // Handle numeric input
        this.display.textContent = this.store.isTypingNewNumber
            ? numberToAdd.toString()
            : `${this.display.textContent}${numberToAdd}`;

        this.store.digitCount++;
        this.store.isTypingNewNumber = false;
    }

    executeOperation() {
        const result = this.calculate();
        if(result > CONFIG.MAX_NUMBER){
            result = "BIG NUMBER";
            this.resetDisplay();
        }
        this.display.textContent = ;
    }

    calculate() {
        const operations = {
            [OPERATORS.ADD]: (a, b) => a + b,
            [OPERATORS.SUBTRACT]: (a, b) => a - b,
            [OPERATORS.MULTIPLY]: (a, b) => a * b,
            [OPERATORS.DIVIDE]: (a, b) => a / b
        };
        const { currentOperation, previousValue, currentValue } = this.store;

        const result = parseFloat(operations[currentOperation]?.(Number(previousValue), Number(currentValue))
        ?.toPrecision(CONFIG.PRECISION) ?? 0);

        console.log(currentOperation,previousValue,currentValue);
        console.log(result);
        return  result;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const display = document.querySelector('.display');
    const keyboard = document.querySelector('.keyboard');

    if (!display || !keyboard) {
        console.error('Required DOM elements not found');
        return;
    }

    new Calculator(display, keyboard);
});
