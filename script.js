const currentDisplay = document.getElementById("current-display");
const previousDisplay = document.getElementById("previous-display");
const numberButtons = document.querySelectorAll("[data-number]");
const operatorButtons = document.querySelectorAll("[data-operator]");
const clearButton = document.querySelector('[data-action="clear"]');
const deleteButton = document.querySelector('[data-action="delete"]');
const percentButton = document.querySelector('[data-action="percent"]');
const signButton = document.querySelector('[data-action="sign"]');
const equalsButton = document.querySelector('[data-action="calculate"]');

let currentNumber = "0";
let previousNumber = "";
let operator = "";
let waitingForNumber = false;

function updateDisplay() {
    currentDisplay.textContent = currentNumber;
    previousDisplay.textContent =
        previousNumber && operator
            ? `${previousNumber} ${getOperatorSymbol(operator)}`
            : "";
}

function getOperatorSymbol(operator) {
    if (operator === "*") return "×";
    if (operator === "/") return "÷";
    if (operator === "-") return "−";
    return "+";
}

function addNumber(number) {
    if (waitingForNumber) {
        currentNumber = number;
        waitingForNumber = false;
        updateDisplay();
        return;
    }
    if (number === "." && currentNumber.includes(".")) {
        return;
    }
    if (currentNumber === "0" && number !== ".") {
        currentNumber = number;
    } else {
        currentNumber += number;
    }
    updateDisplay();
}

function chooseOperator(selectedOperator) {
    if (operator && !waitingForNumber) {
        calculate();
    }
    previousNumber = currentNumber;
    operator = selectedOperator;
    waitingForNumber = true;
    updateDisplay();
}

function calculate() {
    if (!operator || previousNumber === "") {
        return;
    }
    const firstNumber = parseFloat(previousNumber);
    const secondNumber = parseFloat(currentNumber);
    let result;
    switch (operator) {
        case "+":
            result = firstNumber + secondNumber;
            break;
        case "-":
            result = firstNumber - secondNumber;
            break;
        case "*":
            result = firstNumber * secondNumber;
            break;
        case "/":
            if (secondNumber === 0) {
                currentNumber = "Error";
                previousNumber = "";
                operator = "";
                updateDisplay();
                return;
            }
            result = firstNumber / secondNumber;
            break;
    }
    result = Number(result.toFixed(10));
    currentNumber = result.toString();
    previousNumber = "";
    operator = "";
    waitingForNumber = true;
    updateDisplay();
}

function clearCalculator() {
    currentNumber = "0";
    previousNumber = "";
    operator = "";
    waitingForNumber = false;
    updateDisplay();
}

function deleteNumber() {
    if (waitingForNumber || currentNumber === "Error") {
        return;
    }
    if (currentNumber.length === 1) {
        currentNumber = "0";
    } else {
        currentNumber = currentNumber.slice(0, -1);
    }
    updateDisplay();
}

function percentage() {
    if (currentNumber === "Error") {
        return;
    }
    currentNumber = (parseFloat(currentNumber) / 100).toString();
    updateDisplay();
}

function changeSign() {
    if (currentNumber === "0" || currentNumber === "Error") {
        return;
    }
    if (currentNumber.startsWith("-")) {
        currentNumber = currentNumber.substring(1);
    } else {
        currentNumber = "-" + currentNumber;
    }
    updateDisplay();
}

numberButtons.forEach(button => {
    button.addEventListener("click", () => {
        addNumber(button.dataset.number);
    });
});

operatorButtons.forEach(button => {
    button.addEventListener("click", () => {
        chooseOperator(button.dataset.operator);
    });
});

clearButton.addEventListener("click", clearCalculator)
deleteButton.addEventListener("click", deleteNumber);
percentButton.addEventListener("click", percentage);
signButton.addEventListener("click", changeSign);
equalsButton.addEventListener("click", calculate);

document.addEventListener("keydown", event => {
    const key = event.key;
    if (
        (key >= "0" && key <= "9") || key === ".") {
        addNumber(key);
    }
    else if (key === "+" || key === "-" || key === "*" || key === "/") {
        chooseOperator(key);
    }
    else if (key === "Enter" || key === "=") {
        event.preventDefault();
        calculate();
    }
    else if (key === "Backspace") {
        deleteNumber();
    }
    else if (key === "Escape") {
        clearCalculator();
    }
    else if (key === "%") {
        percentage();
    }
});