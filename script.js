const CONFIG = {
    MAX_DIGITS: 9,
    DEFAULT_VALUE: 0,
    NORMAL_MODE: 1,
    TYPING_MODE: 2,
    OPERATIONAL_MODE: 3,
    TYPED_DOT: true,
    NO_TYPED_DOT: false,
};

const wordToNumber = {
    "zero": 0,
    "one": 1,
    "two": 2,
    "three": 3,
    "four": 4,
    "five": 5,
    "six": 6,
    "seven": 7,
    "eight": 8,
    "nine": 9,
    "dot": '.',
};

const OPERATORS = {
    ADD: 'add',
    SUBTRACT: 'subtract',
    MULTIPLY: 'multiply',
    DIVIDE: 'divide',
};

const operate = (num1, num2, operator) => {
    const operations = {
        [OPERATORS.ADD]: (a, b) => a + b,
        [OPERATORS.SUBTRACT]: (a, b) => a - b,
        [OPERATORS.MULTIPLY]: (a, b) => a * b,
        [OPERATORS.DIVIDE]: (a, b) => a / b,
    };

    return operations[operator] ? operations[operator](num1, num2) : "ERROR";
};

const displayResult = (value) => {
    displayElement.textContent = parseFloat(value.toPrecision(9)).toString();
};

const appendDigit = (digit) => {
    if (!storage.isDisplayFull()) {
        storage.incrementCounter();
        displayElement.textContent += wordToNumber[digit];
    }
};


const keyboardElement = document.querySelector('.keyboard');
const displayElement = document.querySelector('.display');

const storage = {
    countedDigits: CONFIG.DEFAULT_VALUE,
    currentMode: CONFIG.NORMAL_MODE,
    isTipedDot: CONFIG.NO_TYPED_DOT,

    incrementCounter() {
        this.countedDigits++;
    },

    isDisplayFull() {
        return this.countedDigits >= CONFIG.MAX_DIGITS;
    },

    reset() {
        this.countedDigits = CONFIG.DEFAULT_VALUE;
        this.currentMode = CONFIG.NORMAL_MODE;
        this.isTipedDot = CONFIG.NO_TYPED_DOT;
    },

    setCurrentMode(mode) {
        this.currentMode = mode;
    },

    getCurrentMode() {
        return this.currentMode;
    },

    toggleTypedDotState() {
        this.isTipedDot = !this.isTipedDot;
    },

};

const handleKeyboardClick = (e) => {
    const target = e.target;

    if (target.classList.contains('digit')) {
        console.log('Digit pressed:', target.id);
        
        if (storage.getCurrentMode() === CONFIG.NORMAL_MODE) {
            const digit = target.id;
            if(digit === 'dot'){
                appendDigit('zero')
            }
            appendDigit(digit);
        }
    }
};

const initializeDisplay = () => {
    displayElement.textContent = CONFIG.DEFAULT_VALUE;
};

document.addEventListener('DOMContentLoaded', () => {
    initializeDisplay();
    
    keyboardElement.addEventListener('click', handleKeyboardClick);
});
