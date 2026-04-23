import './style.css';
import catalogDt from './data.json';
console.log('Данные загружены через import:', catalogDt);


const openButton = document.getElementById('open-button');
const toggleButton = document.getElementById('toggle-button');
const sidePanel = document.getElementById('side-panel');


toggleButton.addEventListener('click', (e) => {
    sidePanel.classList.add('hidden');
    openButton.classList.remove('hidden');
})

openButton.addEventListener('click', (e) => {
    sidePanel.classList.remove('hidden');
    openButton.classList.add('hidden');
})

const addProjectBtn = document.getElementById('add-project-btn');
const addProjectForm = document.querySelector('.add-new-project-container');
const addEmployeeBtn = document.getElementById('add-employee-btn');
const addEmployeeForm = document.querySelector('.add-new-employee-container');

addProjectBtn.addEventListener('click', () => {
    addProjectForm.classList.remove('hidden');
})

addEmployeeBtn.addEventListener('click', () => {
    addEmployeeForm.classList.remove('hidden');
})

const state = {
    selectedYear: '2026',
    selectedMonth: '3', // April
};

const getPeriodKey = () => `${state.selectedYear}-${state.selectedMonth}`;

function updateDashboard() {
    const periodKey = getPeriodKey();
    const currentData = catalogDt.monthlyData[periodKey];
}

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