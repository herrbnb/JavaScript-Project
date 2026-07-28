const display = document.getElementById('display');
const keys = document.querySelector('.keypad');
const themeDots = document.querySelectorAll('.theme-switch__dot');

let expression = '0'; // what's shown on screen
let resetOnNextDigit = false; // true right after "=" so a new digit starts fresh

const OPERATORS = ['+', '-', '*', '/'];

function updateDisplay() {
        display.textContent = expression;
}

function isOperator(char) {
        return OPERATORS.includes(char);
}

function lastChar() {
        return expression.slice(-1);
}

function appendDigit(digit) {
        if (resetOnNextDigit) {
                expression = '0';
                resetOnNextDigit = false;
        }
        if (expression === '0' && digit !== '.') {
                expression = digit;
        } else {
                expression += digit;
        }
}

function appendDecimal() {
        if (resetOnNextDigit) {
                expression = '0';
                resetOnNextDigit = false;
        }
        // find the current number segment (after the last operator)
        const segments = expression.split(/(?<=[+\-*/])|(?=[+\-*/])/);
        const currentSegment = segments[segments.length - 1];
        if (!currentSegment.includes('.')) {
                expression += '.';
        }
}

function appendOperator(op) {
        resetOnNextDigit = false;
        if (isOperator(lastChar())) {
                // replace the previous operator instead of stacking them
                expression = expression.slice(0, -1) + op;
        } else {
                expression += op;
        }
}

function deleteLast() {
        if (resetOnNextDigit) return;
        expression = expression.length > 1 ? expression.slice(0, -1) : '0';
}

function resetAll() {
        expression = '0';
        resetOnNextDigit = false;
}

function calculate() {
        if (isOperator(lastChar())) {
                expression = expression.slice(0, -1);
        }
        try {
                // Safe arithmetic eval: only digits, operators, decimal points allowed
                if (!/^[0-9+\-*/.]+$/.test(expression)) throw new Error('invalid');
                const result = Function(`"use strict"; return (${expression})`)();
                if (!isFinite(result)) throw new Error('divide by zero');
                expression = String(Math.round(result * 1e10) / 1e10);
        } catch (e) {
                expression = 'Error';
                resetOnNextDigit = true;
                updateDisplay();
                return;
        }
        resetOnNextDigit = true;
}

keys.addEventListener('click', (e) => {
        const btn = e.target.closest('.key');
        if (!btn) return;
        
        if (btn.dataset.key !== undefined) {
                const value = btn.dataset.key;
                if (value === '.') {
                        appendDecimal();
                } else if (isOperator(value)) {
                        appendOperator(value);
                } else {
                        appendDigit(value);
                }
        } else if (btn.dataset.action === 'delete') {
                deleteLast();
        } else if (btn.dataset.action === 'reset') {
                resetAll();
        } else if (btn.dataset.action === 'equals') {
                calculate();
        }
        
        updateDisplay();
});

// Keyboard support
window.addEventListener('keydown', (e) => {
        if (/^[0-9]$/.test(e.key)) {
                appendDigit(e.key);
        } else if (isOperator(e.key)) {
                appendOperator(e.key);
        } else if (e.key === '.') {
                appendDecimal();
        } else if (e.key === 'Enter' || e.key === '=') {
                e.preventDefault();
                calculate();
        } else if (e.key === 'Backspace') {
                deleteLast();
        } else if (e.key === 'Escape') {
                resetAll();
        } else {
                return;
        }
        updateDisplay();
});

// Theme switching (in-memory only, resets on reload)
themeDots.forEach((dot) => {
        dot.addEventListener('click', () => {
                const theme = dot.dataset.themeBtn;
                document.body.setAttribute('data-theme', theme);
                themeDots.forEach((d) => d.setAttribute('aria-checked', d === dot ? 'true' : 'false'));
        });
});

updateDisplay();