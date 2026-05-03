import { getData, updateDashboard, renderEmployeesTable, renderProjectsTable } from "./index.js";
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

const activeFilters = { employees: {}, projects: {} }
const initialEmployees = getData().monthlyData[periodKey].employees;
const initialProjects = getData().monthlyData[periodKey].projects;

const projectsContainer = document.getElementById('projects-table-container');
const employeeContainer = document.getElementById('employees-table-container');
const filterPopup = document.querySelector('.filter-popup');

let activeFilterTrigger = null;

function repositionFilterPopup() {
    if (!filterPopup || filterPopup.classList.contains('hidden') || !activeFilterTrigger) return;

    const rect = activeFilterTrigger.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let top = rect.bottom + 5;
    let left = rect.left;

    const popupHeight = filterPopup.offsetHeight;
    const popupWidth = filterPopup.offsetWidth;

    if (top + popupHeight > viewportHeight) {
        top = rect.top - popupHeight - 5;
    }

    if (left + popupWidth > viewportWidth) {
        left = viewportWidth - popupWidth - 10;
    }

    top = Math.max(5, top);
    left = Math.max(5, left);

    filterPopup.style.top = `${top}px`;
    filterPopup.style.left = `${left}px`;
}

window.addEventListener('resize', repositionFilterPopup);
document.addEventListener('scroll', (e) => {
    if (e.target.id === 'main-content' || e.target.closest('#main-content')) {
        repositionFilterPopup();
    }
}, true);

filterPopup.addEventListener('click', (e) => {
    if (e.target.classList.contains('accept-filter')) {
        const inputElement = filterPopup.querySelector('input, select');
        const value = inputElement.value;
        const key = filterPopup.getAttribute('data-key');
        const source = filterPopup.getAttribute('data-source');

        activeFilters[source][key] = value;

        const newRenderData = filterData(key, value, source);

        if (source === "employees") {
            renderEmployeesTable(newRenderData)
        }
        if (source === 'projects') {
            renderProjectsTable(newRenderData)
        }

        renderFilterChips(source);

        filterPopup.classList.add('hidden');
    }
    if (e.target.classList.contains('cancel-filter')) {
        filterPopup.classList.add('hidden');
    }
})

function renderFilterChips(source) {
    const containerId = source === 'employees' ? 'employee-filters-container' : 'project-filters-container';
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';

    const filters = activeFilters[source];

    Object.entries(filters).forEach(([key, value]) => {
        if (!value) return;

        const chip = document.createElement('div');
        chip.className = 'filter-chip';
        const label = document.createElement('span');
        label.className = 'chip-label';
        label.textContent = `${key}: ${value}`;

        const removeBtn = document.createElement('span');
        removeBtn.className = 'chip-remove';
        removeBtn.innerHTML = '&times;';
        removeBtn.style.cursor = 'pointer';
        removeBtn.style.marginLeft = '8px';

        removeBtn.onclick = () => {
            delete activeFilters[source][key];

            const filtered = applyAllFilters(source);

            if (source === 'employees') renderEmployeesTable(filtered);
            else renderProjectsTable(filtered);

            renderFilterChips(source);
        }



        chip.append(label, removeBtn);
        container.appendChild(chip);
    });


}

function applyAllFilters(source) {
    const initialData = source === 'employees' ? initialEmployees : initialProjects;
    let result = [...initialData];

    Object.entries(activeFilters[source]).forEach(([key, value]) => {
        if (value) {
            result = result.filter(item => {
                const itemValue = String(item[key] || "").toLowerCase();
                const filterValue = String(value).toLowerCase();
                return itemValue.includes(filterValue);
            });
        }
    });

    return result;
}


employeeContainer.addEventListener('click', (e) => {
    if (e.target.closest('th') && e.target.classList.contains('filter-icon')) {
        activeFilterTrigger = e.target;
        const filterDt = e.target.closest('th');
        const fullId = e.currentTarget.id;
        const source = fullId.split('-')[0];
        const columnKey = filterDt.getAttribute('data-filter');
        filterPopup.setAttribute('data-key', columnKey);
        filterPopup.setAttribute('data-source', source);
        filterPopup.classList.remove('hidden');
        createFilterContent(columnKey);
        repositionFilterPopup();
    }
})

projectsContainer.addEventListener('click', (e) => {
    if (e.target.closest('th') && e.target.classList.contains('filter-icon')) {
        activeFilterTrigger = e.target;
        const filterDt = e.target.closest('th');
        const fullId = e.currentTarget.id;
        const source = fullId.split('-')[0];
        const columnKey = filterDt.getAttribute('data-filter');
        filterPopup.setAttribute('data-key', columnKey);
        filterPopup.setAttribute('data-source', source);
        filterPopup.classList.remove('hidden');
        createFilterContent(columnKey);
        repositionFilterPopup();
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
    acceptBtn.className = 'accept-filter btn';
    acceptBtn.textContent = 'Apply';
    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'cancel-filter btn';
    cancelBtn.textContent = 'Cancel';
    filterContainer.append(acceptBtn, cancelBtn);
    filterPopup.appendChild(filterContainer);
}



document.addEventListener('click', (e) => {
    if (filterPopup && !filterPopup.classList.contains('hidden')) {
        if (!filterPopup.contains(e.target) && !e.target.classList.contains('filter-icon')) {
            filterPopup.classList.add('hidden');
            activeFilterTrigger = null;
        }
    }
});















export { filterData };