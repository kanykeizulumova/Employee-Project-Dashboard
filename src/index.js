import './style.css';
import catalogDt from './data.json';
console.log('Данные загружены через import:', catalogDt);

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const openButton = document.getElementById('open-button');
const toggleButton = document.getElementById('toggle-button');
const sidePanel = document.getElementById('side-panel');

const projectsContainer = document.getElementById('projects-table-container');
const employeeContainer = document.getElementById('table-container');

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
const employeeCancelBtn = document.getElementById('employee-cancel');
const projectCancelBtn = document.getElementById('project-cancel');

addProjectBtn.addEventListener('click', () => {
    addProjectForm.classList.remove('hidden');
})

addEmployeeBtn.addEventListener('click', () => {
    addEmployeeForm.classList.remove('hidden');
})


employeeCancelBtn.addEventListener('click', () => {
    addEmployeeForm.classList.add('hidden')
})

projectCancelBtn.addEventListener('click', () => {
    addProjectForm.classList.add('hidden')
})

const state = {
    selectedYear: '2026',
    selectedMonth: '2', // March
};

const getPeriodKey = () => `${state.selectedYear}-${state.selectedMonth}`;

function updateDashboard() {
    const periodKey = getPeriodKey();
    const currentData = catalogDt.monthlyData[periodKey];
    if (currentData) {
        renderEmployeesTable(currentData.employees);
        renderProjectsTable(currentData.projects);
    } else {
        renderEmployeesTableEmpty();
        renderProjectsTableEmpty();
    }
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



function renderProjectsTableEmpty() {
    const totalIncome = document.getElementById('total-income');
    totalIncome.innerHTML = `Total Estimated Income: $0.00`;

    const tableHtml = `
        <table id="projects-table">
            <thead>
                <tr>
                    <th class="sortable filterable" data-sort="companyName" data-filter="companyName">
                        Company Name <span class="sort-icon">⇅</span> <span class="filter-icon" title="Filter">⌕</span>
                    </th>
                    <th class="sortable filterable" data-sort="projectName" data-filter="projectName">
                        Project Name <span class="sort-icon">⇅</span> <span class="filter-icon" title="Filter">⌕</span>
                    </th>
                    <th class="sortable" data-sort="budget">Budget <span class="sort-icon">⇅</span></th>
                    <th class="sortable" data-sort="employeeCapacity">Employee Capacity <span class="sort-icon">⇅</span></th>
                    <th>Employees</th>
                    <th class="sortable" data-sort="estimatedIncome">Estimated Income <span class="sort-icon">⇅</span></th>
                    <th>Actions</th>
                </tr>
            </thead>
        </table>
    `;

    projectsContainer.innerHTML = tableHtml;
}

function renderProjectsTable(data) {
    const projectsContainer = document.getElementById('projects-table-container');
    const totalIncome = document.getElementById('total-income');

    const total = data.reduce((sum, proj) => sum + (Number(proj.budjet) || 0), 0);
    totalIncome.innerHTML = `Total Estimated Income: $${total.toLocaleString()}`;

    const tableHtml = `
        <table id="projects-table">
            <thead>
               <tr>
                    <th class="sortable filterable" data-sort="companyName" data-filter="companyName">
                        Company Name <span class="sort-icon">⇅</span> <span class="filter-icon" title="Filter">⌕</span>
                    </th>
                    <th class="sortable filterable" data-sort="projectName" data-filter="projectName">
                        Project Name <span class="sort-icon">⇅</span> <span class="filter-icon" title="Filter">⌕</span>
                    </th>
                    <th class="sortable" data-sort="budget">Budget <span class="sort-icon">⇅</span></th>
                    <th class="sortable" data-sort="employeeCapacity">Employee Capacity <span class="sort-icon">⇅</span></th>
                    <th>Employees</th>
                    <th class="sortable" data-sort="estimatedIncome">Estimated Income <span class="sort-icon">⇅</span></th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${data.map(proj => `
                    <tr>
                        <td>${proj.companyName}</td>
                        <td>${proj.projectname}</td>
                        <td>$ ${Number(proj.budjet).toLocaleString()}</td>
                        <td>
                            <button class="show-btn btn" data-project-id="${proj.id}">Show Assigned Employees</button>
                        </td>
                        <td>
                             <button class="delete-btn btn" data-id="${proj.id}">Delete</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    projectsContainer.innerHTML = tableHtml;
}
function renderEmployeesTableEmpty() {
    const tableHtml = `
        <table id="employees-table">
            <thead>
                <tr>
                    <th class="sortable filterable" data-sort="name" data-filter="name">Name <span class="sort-icon">⇅</span> <span class="filter-icon" title="Filter">⌕</span></th>
                    <th class="sortable filterable" data-sort="surname" data-filter="surname">Surname <span class="sort-icon">⇅</span> <span class="filter-icon" title="Filter">⌕</span></th>
                    <th class="sortable" data-sort="age">Age <span class="sort-icon">⇅</span></th>
                    <th class="sortable filterable" data-sort="position" data-filter="position">Position <span class="sort-icon">⇅</span> <span class="filter-icon" title="Filter">⌕</span></th>
                    <th class="sortable" data-sort="salary">Salary <span class="sort-icon">⇅</span></th>
                    <th class="sortable" data-sort="estimatedPayment">Estimated Payment <span class="sort-icon">⇅</span></th>
                    <th class="sortable filterable" data-sort="projectId" data-filter="projectId">Project <span class="sort-icon">⇅</span> <span class="filter-icon" title="Filter">⌕</span></th>
                    <th class="sortable" data-sort="projectedIncome">Projected Income <span class="sort-icon">⇅</span></th>
                    <th>Actions</th>
                </tr>
            </thead>
        </table>
    `;

    employeeContainer.innerHTML = tableHtml;
}

function calculateAge(birthDateString) {
    if (!birthDateString) return '';
    const birthDate = new Date(birthDateString);
    const date = new Date(state.selectedYear, state.selectedMonth.toLowerCase(), 1);

    let age = date.getFullYear() - birthDate.getFullYear();
    const monthDiff = date.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && date.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

function renderEmployeesTable(data) {
    const tableHtml = `
        <table id="employees-table">
            <thead>
                <tr>
                    <th class="sortable filterable" data-sort="name" data-filter="name">Name <span class="sort-icon">⇅</span> <span class="filter-icon" title="Filter">⌕</span></th>
                    <th class="sortable filterable" data-sort="surname" data-filter="surname">Surname <span class="sort-icon">⇅</span> <span class="filter-icon" title="Filter">⌕</span></th>
                    <th class="sortable" data-sort="age">Age <span class="sort-icon">⇅</span></th>
                    <th class="sortable filterable" data-sort="position" data-filter="position">Position <span class="sort-icon">⇅</span> <span class="filter-icon" title="Filter">⌕</span></th>
                    <th class="sortable" data-sort="salary">Salary <span class="sort-icon">⇅</span></th>
                    <th class="sortable" data-sort="estimatedPayment">Estimated Payment <span class="sort-icon">⇅</span></th>
                    <th class="sortable filterable" data-sort="projectId" data-filter="projectId">Project <span class="sort-icon">⇅</span> <span class="filter-icon" title="Filter">⌕</span></th>
                    <th class="sortable" data-sort="projectedIncome">Projected Income <span class="sort-icon">⇅</span></th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${data.map(emp => `
                    <tr>
                        <td>${emp.name}</td>
                        <td>${emp.surname}</td>
                        <td>${calculateAge(emp.dateofbirth)}</td>
                        <td>${emp.position}</td>
                        <td>$ ${emp.salary.toLocaleString()}</td>
                        
                        <td>${emp.assignments.map(a => a.projectId).join(', ')}</td>
                        <td> <button class="show-assignments-btn btn" data-employee-id="${emp.id}">Show Projects</button>
                        </td >

        <td>
            <button class="vacation-btn btn" data-employee-id="${emp.id}">Availability</button>
            <button class="edit-btn btn" data-employee-id="${emp.id}">Delete</button>
            <button class="assignment-btn btn" data-employee-id="${emp.id}">Assign</button>
        </td>
                    </tr >
        `).join('')}
            </tbody>
        </table>
    `;

    employeeContainer.innerHTML = tableHtml;
}



const navProjects = document.getElementById('nav-projects');
const navEmployees = document.getElementById('nav-employees');
const projectsContent = document.getElementById('projects-content');
const employeesContent = document.getElementById('employees-content');

function setActiveTab(clickedTab) {
    [navProjects, navEmployees].forEach(tab => tab.classList.remove('active'));
    clickedTab.classList.add('active');
}

navProjects.addEventListener('click', (e) => {
    e.preventDefault();
    projectsContent.classList.remove('hidden');
    employeesContent.classList.add('hidden');
    setActiveTab(navProjects);
});

navEmployees.addEventListener('click', (e) => {
    e.preventDefault();
    employeesContent.classList.remove('hidden');
    projectsContent.classList.add('hidden');
    setActiveTab(navEmployees);
});



projectsContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('show-btn')) {
        const projectId = event.target.getAttribute('data-project-id');
        showProjectStaff(projectId);
    }
});

function showProjectStaff(projectId) {
    const periodKey = getPeriodKey();
    const currentData = catalogDt.monthlyData[periodKey];
    const pId = Number(projectId);

    const targetProject = currentData.projects.find(p => p.id === pId);
    const employeeIds = targetProject.assignedEmployees;

    const assignedStaff = currentData.employees.filter(emp =>
        employeeIds.includes(emp.id)
    );

    renderEmployeesAssignments(assignedStaff, pId);
}

function renderEmployeesAssignments(staffList, projectId) {
    const popup = document.getElementById('popup-details');
    const content = document.getElementById('popup-content');
    const header = document.getElementById('popup-header');

    header.innerHTML = `<h3>Assigned Employees</h3> <button class="close-popup-btn btn" onclick="this.closest('#popup-details').style.display='none'">×</button>`;

    if (staffList.length === 0) {
        content.innerHTML = "<p style='padding: 20px;'>No employees assigned to this project.</p>";
    } else {
        const tableHtml = `
            <table id="employees-table">
                <thead>
                    <tr>
                        <th>Employee</th>
                        <th>Capacity</th>
                        <th>Fit</th>
                        <th>Vacation</th>
                        <th>Effective</th>
                        <th>Revenue</th>
                        <th>Cost</th>
                        <th>Profit</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${staffList.map(emp => {

            const job = emp.assignments.find(a => Number(a.projectId) === Number(projectId)) || emp.assignments[0];

            return `
                            <tr>
                                <td>${emp.name} ${emp.surname}</td>
                                <td>${job ? job.AssignedCapacity : '0'}</td>
                                <td>${job ? job.ProjectFit : '0'}</td>
                                <td>
                                <button class="edit-btn btn" data-employee-id="${emp.id}">Edit assignments</button >
                                <button class="unassign-btn btn" data-employee-id="${emp.id}">Unassign</button>
                                </td>
                            </tr>
                        `;
        }).join('')}
                </tbody>
            </table>
        `;
        content.innerHTML = tableHtml;
    }

    popup.style.display = 'block';
}


employeeContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('show-assignments-btn')) {
        const employeeId = event.target.getAttribute('data-employee-id');
        showEmployeeProjects(employeeId);
    }
    if (event.target.classList.contains('vacation-btn')) {
        const employeeId = event.target.getAttribute('data-employee-id');
        const periodKey = getPeriodKey();
        const currentData = catalogDt.monthlyData[periodKey];
        const eId = Number(employeeId);
        const employee = currentData.employees.find(e => e.id === eId);
        if (!employee) return;
        const employeeFullName = employee.name + ' ' + employee.surname;
        createCalendar(state.selectedYear, state.selectedMonth, employee.vacation, employeeFullName);
        calendarWrapper.style.display = 'block';
    };
});


function showEmployeeProjects(employeeId) {
    const periodKey = getPeriodKey();
    const currentData = catalogDt.monthlyData[periodKey];
    const eId = Number(employeeId);

    const employee = currentData.employees.find(e => e.id === eId);
    if (!employee) return;

    const projectIds = employee.assignments.map(a => a.projectId);

    const assignedProjects = currentData.projects.filter(p =>
        projectIds.includes(p.id)
    );
    renderProjectsInPopup(assignedProjects, employee);
}

function renderProjectsInPopup(projects, employee) {
    const popup = document.getElementById('popup-details');
    const content = document.getElementById('popup-content');
    const header = document.getElementById('popup-header');

    header.innerHTML = `<h3>Projects for ${employee.name} ${employee.surname}</h3> 
                        <button class="close-popup-btn btn" onclick="this.closest('#popup-details').style.display='none'">×</button>`;

    if (projects.length === 0) {
        content.innerHTML = "<p style='padding: 20px;'>This employee has no assignments.</p>";
    } else {
        content.innerHTML = `
            <table id="popup-table">
                <thead>
                    <tr>
                        <th>Project Name</th>
                        <th>Capacity</th>
                        <th>Fit</th>
                        <th>Vacation</th>
                        <th>Effective</th>
                        <th>Revenue</th>
                        <th>Cost</th>
                        <th>Profit</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${projects.map(proj => {
            const job = employee.assignments.find(a => a.projectId === proj.id);
            return `
                            <tr>
                                <td>${proj.projectname}</td>
                                <td>${job ? job.AssignedCapacity : '0'}</td>
                                <td>${job ? job.ProjectFit : '0'}</td>
                                <td>
                                    <button class="edit-btn btn" data-employee-id="${employee.id}">Edit assignments</button >
                                    <button class="unassign-btn btn" data-project-id="${proj.id}" data-employee-id="${employee.id}">Unassign</button>
                                </td>
                            </tr>
                        `;
        }).join('')}
                </tbody>
            </table>
        `;
    }
    popup.style.display = 'block';
}

function countWorkingDays(year, month) {
    let workingDays = 0;
    const daysInMonth = new Date(year, Number(month) + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        if (!isWeekend) {
            workingDays++;
        }
    }
    return workingDays;
}

//vacationWorkingDays = count of vacation days that are weekdays;

function countVacationWorkingDays(vacationDates) {
    if (!vacationDates) return 0;

    const validVacationDaysCount = vacationDates.filter((vac) => {
        const date = new Date(vac);
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        return !isWeekend;
    }).length;

    return validVacationDaysCount;
}


function getVacationCoefficient(year, month, vacationDates) {
    let workingDays = countWorkingDays(year, month);
    let vacationWorkingDays = countVacationWorkingDays(vacationDates);
    const vacationCoefficient = (workingDays - vacationWorkingDays) / workingDays;
    return vacationCoefficient;
}


function countAssignedCapacity(year, month, employeeId, projectId) {
    const periodKey = getPeriodKey();
    const currentData = catalogDt.monthlyData[periodKey];
    const employee = currentData.employees.find(e => e.id === Number(employeeId));

    if (!employee || !employee.assignments) return 0;

    const job = employee.assignments.find(a => Number(a.projectId) === Number(projectId));
    return job ? job.AssignedCapacity : 0;
}

function countProjectFit(year, month, employeeId, projectId) {
    const periodKey = getPeriodKey();
    const currentData = catalogDt.monthlyData[periodKey];
    const employee = currentData.employees.find(e => e.id === Number(employeeId));

    if (!employee || !employee.assignments) return 0;

    const job = employee.assignments.find(a => Number(a.projectId) === Number(projectId));
    return job ? job.ProjectFit : 0;
}


console.log(countAssignedCapacity(state.selectedYear, state.selectedMonth, 2, 102));
console.log(countProjectFit(state.selectedYear, state.selectedMonth, 2, 102));

//$$effectiveCapacity = AssignedCapacity x ProjectFit x vacationCoefficient$$


function getEffectiveCapacity(year, month) {
    const assignedCapacity = countAssignedCapacity(year, month, employeeId, projectId);
    const projectFit = countProjectFit(year, month, employeeId, projectId);
    const vacationCoefficient = getVacationCoefficient(year, month, vacationDates);
    return assignedCapacity * projectFit * vacationCoefficient;
}

//usedEffectiveCapacity = sum of all employees' effective capacities
//capacityForRevenue = max(projectCapacity, usedEffectiveCapacity)

function getUsedEffectiveCapacity(year, month) {
    const periodKey = getPeriodKey();
    const currentData = catalogDt.monthlyData[periodKey];
    return currentData.employees.reduce((sum, emp) => {
        const empCapacity = countAssignedCapacity(year, month, emp.id, projectId);
        const empFit = countProjectFit(year, month, emp.id, projectId);
        const empVacationCoefficient = getVacationCoefficient(year, month, emp.vacation);
        return sum + (empCapacity * empFit * empVacationCoefficient);
    }, 0);
}

function getCapacityForRevenue(year, month) {
    const periodKey = getPeriodKey();
    const currentData = catalogDt.monthlyData[periodKey];
    const projectCapacity = currentData.projects.filter(p => p.id === Number(projectId))[0].employeeCapacity;
    const usedEffectiveCapacity = getUsedEffectiveCapacity(year, month);
    return Math.max(projectCapacity, usedEffectiveCapacity);
}

//Revenue per effective capacity = budget ÷ capacity for revenue

function countRevenuePerCapacity(year, month) {
    const periodKey = getPeriodKey();
    const currentData = catalogDt.monthlyData[periodKey];
    const budget = currentData.projects.filter(p => p.id === Number(projectId))[0].budjet;
    const capacityForRevenue = getCapacityForRevenue(year, month);
    return budget / capacityForRevenue;
}






function createCalendar(year, month, vacationDates, fullName) {
    const calendarHeader = document.getElementById('calendar-header');
    const calendarGrid = document.getElementById('calendar-grid');
    const calendarInfo = document.getElementById('calendar-info');
    const backdrop = document.createElement('div');
    backdrop.className = 'popup-backdrop';

    //const vacationDates = ["2026-04-15", "2026-04-16", "2026-04-20"];
    const vacationDays = vacationDates.map(vac => {
        const vacDate = new Date(vac);
        return vacDate.getDate();
    });
    let d = new Date(year, month);
    let table = '<table><tr><th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th></tr><tr>';

    for (let i = 0; i < d.getDay(); i++) {
        table += '<td></td>';
    }

    while (d.getMonth() == month) {
        if (vacationDays.includes(d.getDate())) {
            table += '<td class="vacation-day">' + d.getDate() + '</td > ';
        } else {
            table += '<td>' + d.getDate() + '</td>';
        }
        if (d.getDay() == 6) {
            table += '</tr><tr>';
        }
        d.setDate(d.getDate() + 1);
    }

    if (d.getDay() != 0) {
        for (let i = d.getDay(); i < 7; i++) {
            table += '<td></td>';
        }
    }
    table += '</tr></table>';
    calendarGrid.innerHTML = table;

    let headerTable = `<h2>${fullName} - Availability</h2>
    <h3>${monthNames[month]} ${year}</h3>
    <button class="close-calendar-btn btn">×</button>`
    calendarHeader.innerHTML = headerTable;
    let workingDays = countWorkingDays(year, month);
    let vacationWorkingDays = countVacationWorkingDays(vacationDates);
    const vacationDay = vacationDates.flatMap(vac => {
        const vacDate = new Date(vac);
        return {
            day: vacDate.getDate(),
            month: vacDate.getMonth()
        };
    });
    const beautifulOutput = vacationDay.map(item => {
        return `${item.day}.${item.month}`;
    }).join(', ');

    const workedDays = workingDays - vacationWorkingDays;

    let infoHeader = `<p>Working Days: ${workedDays} / ${workingDays} days</p>
    <div id="working-days-info">
    <p>Vacation Days:</p>
    <ul>${beautifulOutput}</ul>
    <button class="set-vacation-btn btn">Set Vacation</button>
    </div>`
    calendarInfo.innerHTML = infoHeader;


    document.body.appendChild(backdrop);

}

function getDay(date) {
    let day = date.getDay();
    if (day == 0) day = 7;
    return day - 1;
}
const calendarWrapper = document.getElementById('calendar-wrapper');

calendarWrapper.addEventListener('click', (event) => {
    if (event.target.classList.contains('close-calendar-btn')) {
        document.getElementById('calendar-header').innerHTML = '';
        document.getElementById('calendar-grid').innerHTML = '';
        const backdrop = document.querySelector('.popup-backdrop');
        if (backdrop) {
            backdrop.remove();
        }
        calendarWrapper.style.display = 'none';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    updateDashboard();
});