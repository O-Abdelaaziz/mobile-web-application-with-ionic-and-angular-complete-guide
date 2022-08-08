const reasonInput = document.querySelector("#input-reason");
const amountInput = document.querySelector("#input-amount");
const expensesList = document.querySelector("#expenses-list");
const saveBtn = document.querySelector("#btn-save");
const clearBtn = document.querySelector("#btn-clear");


saveBtn.addEventListener('click', () => {
    const enteredReasonInput = reasonInput.value;
    const enteredAmountInput = amountInput.value;

    if (enteredReasonInput.trim().length <= 0 || enteredAmountInput.trim().length <= 0 || enteredAmountInput <= 0) {
        return;
    }

    const newIonItem = document.createElement('ion-item');
    newIonItem.textContent = enteredReasonInput + ': $' + enteredAmountInput;
    expensesList.appendChild(newIonItem);
});

clearBtn.addEventListener('click', () => {
    console.log('clear btn clicked');
});