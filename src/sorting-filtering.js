import { getData, updateDashboard } from "./index.js";
const state = {
    selectedYear: '2026',
    selectedMonth: '2', // March
};
const getPeriodKey = () => `${state.selectedYear}-${state.selectedMonth}`;
let periodKey = getPeriodKey();
let currentData = getData().monthlyData[periodKey];
const monthSelect = document.getElementById('month-select');
const yearSelect = document.getElementById('year-select');

monthSelect.addEventListener('change', (e) => {
    state.selectedMonth = e.target.value;
    updateDashboard();
});

yearSelect.addEventListener('change', (e) => {
    state.selectedYear = e.target.value;
    updateDashboard();
});



function filterData(key, query, source) {
    const q = query.toLowerCase();
    // currentData[source] выберет либо массив .employees, либо .projects
    return currentData[source].filter(item =>
        item[key].toLowerCase().includes(q)
    );
}

const projectsContainer = document.getElementById('projects-table-container');
const employeeContainer = document.getElementById('employees-table-container');
const filterPopup = document.querySelector('.filter-popup');

filterPopup.addEventListener('click', (e) => {
    if (e.target.classList.contains('accept-filter')) {
        const inputElement = filterPopup.querySelector('input, select');
        const value = inputElement.value;
        const key = filterPopup.getAttribute('data-key');
        const source = filterPopup.getAttribute('data-source');
        filterData(key, value, source);
    }
    if (e.target.classList.contains('cancel-filter')) {
        filterPopup.classList.add('hidden');
    }
})

employeeContainer.addEventListener('click', (e) => {
    if (e.target.closest('th') && e.target.classList.contains('filter-icon')) {
        const filterDt = e.target.closest('th');
        const fullId = e.currentTarget.id;
        const source = fullId.split('-')[0];
        const columnKey = filterDt.getAttribute('data-filter');
        filterPopup.setAttribute('data-key', columnKey);
        filterPopup.setAttribute('data-source', source);
        filterPopup.classList.remove('hidden');
        createFilterContent(columnKey)
    }
})

projectsContainer.addEventListener('click', (e) => {
    if (e.target.closest('th') && e.target.classList.contains('filter-icon')) {
        const filterDt = e.target.closest('th');
        const fullId = e.currentTarget.id;
        const source = fullId.split('-')[0];
        const columnKey = filterDt.getAttribute('data-filter');
        filterPopup.setAttribute('data-key', columnKey);
        filterPopup.setAttribute('data-source', source);
        filterPopup.classList.remove('hidden');
        createFilterContent(columnKey)
    }
})

function createFilterContent(data) {
    filterPopup.innerHTML = '';

    if (data === 'position') {
        const select = document.createElement('select');
        const positions = ['Select position', 'Junior', 'Middle', 'Senior', 'Lead', 'Architect', 'BO'];
        const options = positions.map(pos => {
            const opt = document.createElement('option');
            opt.value = pos;
            opt.textContent = pos;
            return opt;
        });
        select.append(...options);

        filterPopup.appendChild(select);
        createBtns()
    } else {
        const newInput = document.createElement('input');

        newInput.type = 'text';
        newInput.placeholder = `Filter by ${data}`;
        newInput.autofocus = true;
        filterPopup.appendChild(newInput);
        createBtns()
    }
}

function createBtns() {
    const filterContainer = document.createElement('div');
    filterContainer.className = 'filter-btns';
    const acceptBtn = document.createElement('button');
    acceptBtn.className = 'accept-filter';
    acceptBtn.textContent = 'Apply';
    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'cancel-filter';
    cancelBtn.textContent = 'Cancel';
    filterContainer.append(acceptBtn, cancelBtn);
    filterPopup.appendChild(filterContainer);
}



















export { filterData };