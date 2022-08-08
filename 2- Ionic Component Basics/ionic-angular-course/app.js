const reasonInput = document.querySelector("#input-reason");
const amountInput = document.querySelector("#input-amount");
const saveBtn = document.querySelector("#btn-save");
const clearBtn = document.querySelector("#btn-clear");


saveBtn.addEventListener('click', () => {
    const enteredReasonInput = reasonInput.value;
    const enteredAmountInput = amountInput.value;

    if (enteredReasonInput.trim().length <= 0 || enteredAmountInput.trim().length <= 0 || enteredAmountInput <= 0) {
        return;
    }
    console.log(enteredReasonInput, enteredAmountInput);
});

clearBtn.addEventListener('click', () => {
    console.log('clear btn clicked');
});