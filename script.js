class Calculator {
            constructor(previousOperandTextElement, currentOperandTextElement) {
                this.previousOperandTextElement = previousOperandTextElement;
                this.currentOperandTextElement = currentOperandTextElement;
                this.clear();
            }

            clear() {
                this.currentOperand = '0';
                this.previousOperand = '';
                this.operation = undefined;
            }

            delete() {
                this.currentOperand = this.currentOperand.toString().slice(0, -1);
                if (this.currentOperand === '') {
                    this.currentOperand = '0';
                }
            }

            appendNumber(number) {
                if (number === '.' && this.currentOperand.includes('.')) return;
                if (this.currentOperand === '0' && number !== '.') {
                    this.currentOperand = number;
                } else {
                    this.currentOperand = this.currentOperand.toString() + number.toString();
                }
            }

            chooseOperation(operation) {
                if (this.currentOperand === '') return;
                if (this.previousOperand !== '') {
                    this.compute();
                }
                this.operation = operation;
                this.previousOperand = this.currentOperand;
                this.currentOperand = '';
            }

            compute() {
                let computation;
                const prev = parseFloat(this.previousOperand);
                const current = parseFloat(this.currentOperand);
                if (isNaN(prev) || isNaN(current)) return;

                switch (this.operation) {
                    case '+':
                        computation = prev + current;
                        break;
                    case '-':
                        computation = prev - current;
                        break;
                    case '×':
                        computation = prev * current;
                        break;
                    case '÷':
                        computation = prev / current;
                        break;
                    default:
                        return;
                }

                this.currentOperand = computation.toString();
                this.operation = undefined;
                this.previousOperand = '';
            }

            updateDisplay() {
                this.currentOperandTextElement.innerText = this.currentOperand;
                if (this.operation != null) {
                    this.previousOperandTextElement.innerText = 
                        `${this.previousOperand} ${this.operation}`;
                } else {
                    this.previousOperandTextElement.innerText = '';
                }
            }
        }

        const numberButtons = document.querySelectorAll('[data-number]');
        const operationButtons = document.querySelectorAll('[data-action]');
        const equalsButton = document.querySelector('[data-action="equals"]');
        const deleteButton = document.querySelector('[data-action="delete"]');
        const clearButton = document.querySelector('[data-action="clear"]');
        const previousOperandTextElement = document.getElementById('previous-operand');
        const currentOperandTextElement = document.getElementById('current-operand');

        const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

        numberButtons.forEach(button => {
            button.addEventListener('click', () => {
                calculator.appendNumber(button.innerText);
                calculator.updateDisplay();
            });
        });

        operationButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (button.dataset.action === 'add' || 
                    button.dataset.action === 'subtract' || 
                    button.dataset.action === 'multiply' || 
                    button.dataset.action === 'divide') {
                    calculator.chooseOperation(button.innerText);
                    calculator.updateDisplay();
                }
            });
        });

        equalsButton.addEventListener('click', () => {
            calculator.compute();
            calculator.updateDisplay();
        });

        clearButton.addEventListener('click', () => {
            calculator.clear();
            calculator.updateDisplay();
        });

        deleteButton.addEventListener('click', () => {
            calculator.delete();
            calculator.updateDisplay();
        });

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if ((e.key >= 0 && e.key <= 9) || e.key === '.') {
                calculator.appendNumber(e.key);
                calculator.updateDisplay();
            } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
                calculator.chooseOperation(
                    e.key === '*' ? '×' : 
                    e.key === '/' ? '÷' : e.key
                );
                calculator.updateDisplay();
            } else if (e.key === 'Enter' || e.key === '=') {
                calculator.compute();
                calculator.updateDisplay();
            } else if (e.key === 'Escape') {
                calculator.clear();
                calculator.updateDisplay();
            } else if (e.key === 'Backspace') {
                calculator.delete();
                calculator.updateDisplay();
            }
        });