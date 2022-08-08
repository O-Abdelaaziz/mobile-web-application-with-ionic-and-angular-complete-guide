const reasonInput = document.querySelector("#input-reason");
const amountInput = document.querySelector("#input-amount");
const expensesList = document.querySelector("#expenses-list");
const totalExpensesOutput = document.querySelector("#total-expenses");
const saveBtn = document.querySelector("#btn-save");
const clearBtn = document.querySelector("#btn-clear");
const alertContainer = document.querySelector("#alert");

let totalExpenses = 0;

saveBtn.addEventListener('click', () => {
    const enteredReasonInput = reasonInput.value;
    const enteredAmountInput = amountInput.value;

    if (enteredReasonInput.trim().length <= 0 || enteredAmountInput.trim().length <= 0 || enteredAmountInput <= 0) {
        presentAlert()
        return;
    }

    const newIonItem = document.createElement('ion-item');
    newIonItem.textContent = enteredReasonInput + ': $' + enteredAmountInput;
    expensesList.appendChild(newIonItem);

    totalExpenses += +enteredAmountInput;
    totalExpensesOutput.textContent = totalExpenses;

    clearInput();
});

const clearInput = () => {
    reasonInput.value = '';
    amountInput.value = '';
}

async function presentAlert() {
    const alert = document.createElement('ion-alert');
    alert.header = 'Error';
    alert.subHeader = 'Invalid Inputs';
    alert.message = 'Please enter valid reason and amount';
    alert.buttons = ['Okay'];

    alertContainer.appendChild(alert);
    await alert.present();
}


clearBtn.addEventListener('click', clearInput);