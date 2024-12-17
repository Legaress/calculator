// Configuration constants for the calculator
const CONFIG = {
    MAX_DIGITS: 9, // Max digits in display
    DEFAULT_VALUE: '0', // Default display value
    DECIMAL_SEPARATOR: '.', // Decimal separator
    PRECISION: 9, // Decimal precision
    MAX_NUMBER: 999999999, // Max displayable number
};

// Mapping of number names to values
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
    dot: CONFIG.DECIMAL_SEPARATOR // Decimal separator
};

// Supported arithmetic operations
const OPERATORS = {
    ADD: 'add',
    SUBTRACT: 'subtract',
    MULTIPLY: 'multiply',
    DIVIDE: 'divide'
};

// Command interface
class Command {
    execute(a, b) {}
}

// Concrete command classes for each operation
class AddCommand extends Command {
    execute(a, b) {
        return a + b;
    }
}

class SubtractCommand extends Command {
    execute(a, b) {
        return a - b;
    }
}

class MultiplyCommand extends Command {
    execute(a, b) {
        return a * b;
    }
}

class DivideCommand extends Command {
    execute(a, b) {
        return a / b;
    }
}

// Calculator class definition
class Calculator {
    constructor(display, keyboard) {
        this.display = display; // Display element
        this.keyboard = keyboard; // Keyboard element
        this.store = this.initializeStore(); // State storage
        this.initialize(); // Set up event listeners
        this.operations = {
            [OPERATORS.ADD]: new AddCommand(),
            [OPERATORS.SUBTRACT]: new SubtractCommand(),
            [OPERATORS.MULTIPLY]: new MultiplyCommand(),
            [OPERATORS.DIVIDE]: new DivideCommand(),
        };
    }

    // Initialize state storage
    initializeStore() {
        return {
            digitCount: 0, // Count of displayed digits
            isTypingNewNumber: true, // New number flag
            hasDecimal: false, // Decimal point flag
            previousValue: null, // Previous value
            currentValue: null, // Current value
            currentOperation: null // Current operation
        };
    }

    // Set up initial display and event listeners
    initialize() {
        this.resetDisplay(); // Reset display
        this.keyboard.addEventListener('click', (e) => this.handleKeyboardClick(e)); // Keyboard click listener
    }

    // Reset display and state storage
    resetDisplay() {
        this.display.textContent = CONFIG.DEFAULT_VALUE; // Default value
        this.store = this.initializeStore(); // Reinitialize state
    }

    // Handle keyboard click events
    handleKeyboardClick(event) {
        const target = event.target; // Clicked target

        if (target.classList.contains('digit')) { 
            this.handleDigitInput(target.id); // Handle digit input
        } else if (target.id === 'clear') { 
            this.resetDisplay(); // Clear display
        } else if (target.classList.contains('operator')) { 
            this.handleOperatorInput(target.id); // Handle operator input
        } else if (target.classList.contains('equals')) { 
            this.handleEqualsInput(); // Handle equals input
        } else if (target.id === 'sign') {
            this.toggleSign(); // Toggle sign
        } else if (target.id === 'percent') {
            this.convertToPercentage(); // Convert to percentage
        }
    }

    convertToPercentage() {
        const currentValue = this.getCurrentDisplayValue();
        if (!isNaN(currentValue)) {
            const result = currentValue / 100; // Percentage conversion
            this.updateDisplay(result);
        }
    }

    toggleSign() {
        const currentValue = this.getCurrentDisplayValue();
        const result = currentValue * (-1);
        this.updateDisplayAndCheckBounds(result);
    }

    getCurrentDisplayValue() {
        return parseFloat(this.display.textContent);
    }

    // Update display and check bounds
    updateDisplay(value) {
        this.display.textContent = parseFloat(value.toPrecision(9)).toString();
    }

    // Handle digit input
    handleDigitInput(digit) {
        if (this.store.digitCount >= CONFIG.MAX_DIGITS) return; // Max digits check

        if (!NUMBERS.hasOwnProperty(digit)) { 
            console.error(`Invalid digit input: ${digit}`); 
            return; 
        }

        const isDot = digit === 'dot'; 
        const numberToAdd = NUMBERS[digit]; 

        if (isDot) { 
            if (this.store.hasDecimal) return; // Ignore additional decimals
            this.display.textContent += CONFIG.DECIMAL_SEPARATOR; 
            this.store.hasDecimal = true; 
        } else { 
            this.display.textContent = this.store.isTypingNewNumber 
                ? numberToAdd.toString() 
                : this.display.textContent + numberToAdd.toString();
            this.store.digitCount = this.store.isTypingNewNumber ? 1 : this.store.digitCount + 1; // Update count
        }

        this.store.isTypingNewNumber = false; // New number flag
    }

    // Handle operator input
    handleOperatorInput(operator) {
        this.store.currentValue = this.getCurrentDisplayValue(); // Update current value
        if (this.store.currentOperation && !this.store.isTypingNewNumber) { 
            this.executeOperation(); // Execute existing operation
        } 
        this.store.previousValue = this.store.previousValue ?? this.store.currentValue; // Set previous value
        this.store.currentOperation = operator; // Set current operation
        this.store.isTypingNewNumber = true; // New number flag
        this.store.digitCount = 0; 
        this.store.hasDecimal = false; // Reset decimal state
    }

    // Handle equals button input
    handleEqualsInput() {
        if (this.store.currentOperation && !this.store.isTypingNewNumber) { 
            this.store.currentValue = this.getCurrentDisplayValue(); 
            this.executeOperation(); 
        }
        
        this.resetAfterCalculation(); // Reset state
    }

    // Execute the current operation
    executeOperation() {
        const { currentOperation, previousValue, currentValue } = this.store;
        const operation = this.operations[currentOperation];

        if (operation) {
            const result = operation.execute(previousValue, currentValue);
            this.updateDisplayAndCheckBounds(result); // Update display
            this.resetAfterCalculation(true);
        }
    }

    // Update display and check bounds
    updateDisplayAndCheckBounds(value) {
        if ( value > CONFIG.MAX_NUMBER || value < -1 * CONFIG.MAX_NUMBER) {
            console.warn('Result exceeds maximum limit');
            this.display.textContent = parseFloat(value.toString()).toPrecision(4).toString();
        } else {
            this.display.textContent = parseFloat(value.toPrecision(9)).toString();
        }
    }

    // Reset states after calculation
    resetAfterCalculation(keepPreviousValue = false) {
        if (!keepPreviousValue) { 
            this.store.previousValue = null; 
        }
        
        this.store.currentOperation = null; // Clear operation
        this.store.currentValue = null; // Reset current value
        this.store.isTypingNewNumber = true; 
        this.store.digitCount = 0; 
        this.store.hasDecimal = false; // Reset decimal state
    }
}

// Initialize calculator on DOM content load
document.addEventListener('DOMContentLoaded', () => {
    const display = document.querySelector('.display'); // Display element
    const keyboard = document.querySelector('.keyboard'); // Keyboard element

    if (!display || !keyboard) { 
        console.error('Required DOM elements not found'); 
        return;
    }

    new Calculator(display, keyboard); // Create Calculator instance
});
