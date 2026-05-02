const addEmplForm = document.querySelector('.add-new-employee-container .contact-form-in');
const addPorjForm = document.querySelector('.add-new-project-container .contact-form-in');

function validateInput(input) {
    const errorSpan = input.nextElementSibling;
    if (!errorSpan || !errorSpan.classList.contains('error')) return;

    if (input.id === 'dob') {
        const birthDate = new Date(input.value);
        if (!isNaN(birthDate)) {
            const today = new Date();
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
    }

    if (!input.validity.valid) {
        errorSpan.textContent = input.validationMessage;
        errorSpan.classList.add('active');
    } else {
        errorSpan.textContent = '';
        errorSpan.classList.remove('active');
    }
}

function validateAllInputs(form) {
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => validateInput(input));
}

function handleFormInput(form) {
    return (e) => {
        validateInput(e.target);
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = !form.checkValidity();
        }
    };
}

function handleFormSubmit(form) {
    return (e) => {
        validateAllInputs(form);
        if (!form.checkValidity()) {
            e.preventDefault();
            e.stopImmediatePropagation();
        }
    };
}

if (addEmplForm) {
    addEmplForm.addEventListener('input', handleFormInput(addEmplForm));
    addEmplForm.addEventListener('submit', handleFormSubmit(addEmplForm), true);
}

if (addPorjForm) {
    addPorjForm.addEventListener('input', handleFormInput(addPorjForm));
    addPorjForm.addEventListener('submit', handleFormSubmit(addPorjForm), true);
}