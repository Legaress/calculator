// Configuration constants for the calculator
const CONFIG = {
    MAX_DIGITS: 9, // Maximum number of digits allowed in the display
    DEFAULT_VALUE: '0', // Default value displayed at initialization
    DECIMAL_SEPARATOR: '.', // Character used for decimal separation
    PRECISION: 9, // Decimal precision for calculations
    MAX_NUMBER: 999999999, // Maximum number that can be displayed
};

// Mapping of number names to their numeric values
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
    dot: CONFIG.DECIMAL_SEPARATOR // Use the configured decimal separator
};

// Supported arithmetic operations
const OPERATORS = {
    ADD: 'add',
    SUBTRACT: 'subtract',
    MULTIPLY: 'multiply',
    DIVIDE: 'divide'
};

// Calculator class definition
class Calculator {
    constructor(display, keyboard) {
        this.display = display; // Reference to the display element
        this.keyboard = keyboard; // Reference to the keyboard element
        this.store = this.initializeStore(); // Initialize state storage
        this.initialize(); // Set up event listeners and initial display
    }

    // Initialize the state storage for calculator operations
    initializeStore() {
        return {
            digitCount: 0, // Count of digits currently displayed
            isTypingNewNumber: true, // Flag to indicate if a new number is being typed
            hasDecimal: false, // Flag to track if a decimal point has been used
            previousValue: null, // Store the previous value for operations
            currentValue: null, // Store the current value being processed
            currentOperation: null // Store the current operation selected
        };
    }

    // Set up initial display and event listeners for keyboard input
    initialize() {
        this.resetDisplay(); // Reset the display to default value
        this.keyboard.addEventListener('click', (e) => this.handleKeyboardClick(e)); // Event listener for keyboard clicks
    }

    // Reset display and state storage to initial conditions
    resetDisplay() {
        this.display.textContent = CONFIG.DEFAULT_VALUE; // Set display to default value
        this.store = this.initializeStore(); // Reinitialize state storage
    }

    // Handle keyboard click events based on target element clicked
    handleKeyboardClick(event) {
        const target = event.target; // Get the clicked target

        if (target.classList.contains('digit')) { 
            this.processDigitInput(target.id); // Process digit input if it's a digit button
        } else if (target.id === 'clear') { 
            this.resetDisplay(); // Reset display if clear button is clicked
        } else if (target.classList.contains('operator')) { 
            this.processOperatorInput(target.id); // Process operator input if it's an operator button
        } else if (target.classList.contains('equals')) { 
            this.processEqualsInput(); // Process equals input if equals button is clicked
        } else if (target.id === 'sign') {
            this.processChangeSignInput();
        } else if (target.id === 'percent') {
            
        }
    }

    processChangeSignInput(){
        const result = parseFloat(this.display.textContent) * (-1);
        this.display.textContent = result.toString();
    }
    // Handle input of digits (0-9 or decimal point)
    processDigitInput(digit) {
        if (this.store.digitCount >= CONFIG.MAX_DIGITS) return; // Prevent adding more digits than allowed

        if (!NUMBERS.hasOwnProperty(digit)) { 
            console.error(`Invalid digit input: ${digit}`); 
            return; 
        }

        const isDot = digit === 'dot'; 
        const numberToAdd = NUMBERS[digit]; 

        if (isDot) { 
            if (this.store.hasDecimal) return; // Ignore additional decimal points if one already exists
            this.display.textContent += CONFIG.DECIMAL_SEPARATOR; 
            this.store.hasDecimal = true; 
        } else { 
            if (this.store.isTypingNewNumber) { 
                this.display.textContent = numberToAdd.toString(); 
                this.store.digitCount = 1; // Reset digit count for new number input
            } else { 
                this.display.textContent += numberToAdd.toString(); 
                this.store.digitCount++; 
            }
        }

        this.store.isTypingNewNumber = false; // Set flag indicating that a new number is not being typed anymore
    }

    // Handle operator input (addition, subtraction, etc.)
    processOperatorInput(operator) {
        if (this.store.currentOperation && !this.store.isTypingNewNumber) { 
            this.store.currentValue = parseFloat(this.display.textContent); 
            this.executeOperation(); // Execute operation if one is already set and a new number isn't being typed
        } else { 
            if (this.store.previousValue === null) { 
                this.store.previousValue = parseFloat(this.display.textContent); // Set previous value on first operator input
            }
        }
        
        this.store.currentOperation = operator; // Set current operation based on user input
        this.store.isTypingNewNumber = true; // Indicate that a new number is being typed next
        this.store.digitCount = 0; 
        this.store.hasDecimal = false; // Reset decimal state for new input
    }

    // Handle equals button input to perform calculation and show result
    processEqualsInput() {
        if (this.store.currentOperation && !this.store.isTypingNewNumber) { 
            this.store.currentValue = parseFloat(this.display.textContent); 
            this.executeOperation(); 
        }
        
        this.resetAfterCalculation(); // Reset state after calculation is done
    }

    // Execute the current operation based on stored values and update display with result
    executeOperation() {
        const result = this.calculate(); 

        if (result >= CONFIG.MAX_NUMBER) { 
            console.warn('Result exceeds maximum number limit'); 
            this.resetDisplay(); 
            this.display.textContent = 'NaN'; 
            return;
        }

        this.display.textContent = result.toString(); 
        
        this.resetAfterCalculation(true); // Prepare for the next operation while keeping previous value intact
    }

    // Perform calculation based on stored values and operation type
    calculate() {
        const operations = {
            [OPERATORS.ADD]: (a, b) => a + b,
            [OPERATORS.SUBTRACT]: (a, b) => a - b,
            [OPERATORS.MULTIPLY]: (a, b) => a * b,
            [OPERATORS.DIVIDE]: (a, b) => a / b,
        };

        const { currentOperation, previousValue, currentValue } = this.store;

        const result = operations[currentOperation]?.(previousValue, currentValue);
        
        console.log(`Calculating ${previousValue} ${currentOperation} ${currentValue} = ${result}`);
        
        return parseFloat(result?.toPrecision(CONFIG.PRECISION) ?? 0); // Return result with defined precision or zero by default.
    }

    // Reset states after calculation is complete to prepare for next input.
    resetAfterCalculation(keepPreviousValue = false) {
        if (!keepPreviousValue) { 
            this.store.previousValue = null; 
        }
        
        this.store.currentOperation = null; // Clear current operation after calculation is done.
        this.store.currentValue = null; // Reset current value for next calculation.
        this.store.isTypingNewNumber = true; 
        this.store.digitCount = 0; 
        this.store.hasDecimal = false; // Reset decimal state for new input.
    }
}

// Initialize calculator once DOM content is fully loaded.
document.addEventListener('DOMContentLoaded', () => {
    const display = document.querySelector('.display'); // Select display element from DOM.
    const keyboard = document.querySelector('.keyboard'); // Select keyboard element from DOM.

    if (!display || !keyboard) { 
        console.error('Required DOM elements not found'); 
        return;
    }

    new Calculator(display, keyboard); // Create a new instance of Calculator with selected display and keyboard elements.
});
