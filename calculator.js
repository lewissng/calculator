const displayNum = document.querySelector('.total-display');
const functionContainer = document.querySelector('.function-container');
const numKeyed = document.querySelectorAll('.number');
const calculationResult = document.querySelector('#result');
const clearEntry = document.querySelector('#clear');
const backspaceKey = document.querySelector('#backspace');
const percentageConversion = document.querySelector('#percent');

let displayValue = ''
let a = ''
let b = ''
let prev = 0;
let next = '';
let operator = null;
let secondOperator = null;
let total = 0;


function add(a, b) {
    return parseFloat(a) + parseFloat(b);
}

function subtract(a, b) {
    return parseFloat(a) - parseFloat(b);
}

function divide(a, b) {
    //Prevent dividing 0
    if (parseFloat(b) !== 0) {
        return parseFloat(a) / parseFloat(b);
    } else {
        return 'Error'
    }
}

function multiply(a, b) {
    return parseFloat(a) * parseFloat(b);
}

function percent(a) {
    return parseFloat(a) / 100;
}


//display total to the calculator
function displayTotal(total) {
    if (total && String(total).length > 11) {
        displayNum.textContent = String(total).substring(0, 11);
    } else {
        displayNum.textContent = total;
    }
}
// Display number button pressed.
function display() {
    return displayNum.textContent = displayValue;
}

// Calculate and return total and display
function operate(a, operator, b) {
    if (operator === 'add') {
        total = add(a, b);
    } else if (operator === 'subtract') {
        total = subtract(a, b);
    } else if (operator === 'divide') {
        total = divide(a, b);
    } else if (operator === 'multiply') {
        total = multiply(a, b);
    }
    displayTotal(total);
    return total;
}


functionContainer.addEventListener('click', function (e) {
    let className = e.target.className.split(' ')[1];
    let clickedId = e.target.id;

    if (className === 'operator' && !operator) {
        operator = clickedId;
    }

    // When calculating multiple things (before = is pressed), to continue calcualting.
    // calculate than save to prev variable. any number pressed, stored into next variable.
    if (className === 'operator' && operator && (a && b) && !prev) {
        secondOperator = clickedId;
        prev = operate(a, operator, b);
    }
    // operator(*-+/) second click
    else if (className === 'operator' && prev) {
        // from now this will be used untill we hit '='
        prev = operate(prev, secondOperator, next);
        secondOperator = clickedId;
        next = '';
    }
})

// EventListen for number buttons. when operator variable is empty add to a, otherwise add to b.
for (let i = 0; i < numKeyed.length; i++) {
    numKeyed[i].addEventListener('click', function (e) {
        if (!prev) {
            // if it is the start of calculation store into a variable
            if (!operator) {
                a += e.target.id;
                displayValue = a;
                display();
            } else {
                b += e.target.id;
                displayValue = b;
                display();
            }
        } else {
            // When operator(*-+/) is clicked sencond time store into next variable
            next += e.target.id;
            displayValue = next;
            display();
        }
    })
}

//clear all, back to original values
clearEntry.addEventListener('click', function () {
    displayValue = '0';
    a = '';
    b = '';
    prev = 0;
    next = '';
    operator = null;
    secondOperator = null;
    total = 0;
    display();
})

// '=' button pressed
calculationResult.addEventListener('click', function () {
    if (!prev && (a && b)) {
        operate(a, operator, b);
    } else if (a && !b) {
        //when only numbers inserted and result is clicked
        displayValue = a;
        display();
    } else {
        operate(prev, secondOperator, next);
    }
    //back to original values
})

backspaceKey.addEventListener('click', function () {
    if (a || b || next) {
        a = a.substring(0, a.length - 1);
        b = b.substring(0, b.length - 1);
        next = next.substring(0, next.length - 1);
        displayValue = displayValue.substring(0, displayValue.length - 1);
    }
    if (displayValue.length < 1) {
        displayValue = '0';
    }
    display();
})

//When percent button is clicked, calculate and reset all.
percentageConversion.addEventListener('click', function () {
    if (!operator) {
        total = percent(a);
        displayTotal(total);
    } else if (operator && b && !prev) {
        prev = operate(a, operator, b);
        total = percent(prev);
        displayTotal(total);
        displayValue = '';
        a = '';
        b = '';
        prev = 0;
        operator = null;
        secondOperator = null;
        total = 0;
    } else if (prev) {

        prev = operate(prev, secondOperator, next);
        total = percent(total);
        displayTotal(total);
        displayValue = '';
        a = '';
        b = '';
        prev = 0;
        operator = null;
        secondOperator = null;
        total = 0;
    }
})