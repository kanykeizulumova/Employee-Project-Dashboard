import { getData } from "./index.js";
const state = {
    selectedYear: '2026',
    selectedMonth: '2', // March
};
const getPeriodKey = () => `${state.selectedYear}-${state.selectedMonth}`;
let periodKey = getPeriodKey();
let currentData = getData().monthlyData[periodKey];


function filterData(key, query, source) {
    const q = query.toLowerCase();
    // currentData[source] выберет либо массив .employees, либо .projects
    return currentData[source].filter(item =>
        item[key].toLowerCase().includes(q)
    );
}

console.log(filterData('name', 'ev', 'employees'));