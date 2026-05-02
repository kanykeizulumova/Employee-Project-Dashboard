const addEmplForm = document.querySelector('.add-new-employee-container .contact-form-in');
const addPorjForm = document.querySelector('.add-new-project-container .contact-form-in');


addEmplForm.addEventListener('input', (e) => {
    const input = e.target;
    const errorSpan = input.nextElementSibling;

    if (input.type === 'date') {
        const today = new Date();
        const birthDate = new Date(input.value);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        if (age < 18) {
            input.setCustomValidity('You must be at least 18 years old.');
        } else {
            input.setCustomValidity('');
        }
    }

    if (!input.validity.valid) {
        errorSpan.textContent = input.validationMessage;
    } else {
        errorSpan.textContent = '';
    }

    addEmplForm.querySelector('button[type="submit"]').disabled = !addEmplForm.checkValidity();
});


addPorjForm.addEventListener('input', (e) => {
    const input = e.target;
    const errorSpan = input.nextElementSibling;
    if (!input.validity.valid) {
        errorSpan.textContent = input.validationMessage;
    } else {
        errorSpan.textContent = '';
    }

    addPorjForm.querySelector('button[type="submit"]').disabled = !addPorjForm.checkValidity();
});