import './style.css';
import './validation.js';
import './sorting-filtering.js';
import { createCalendar, countVacationWorkingDays, getVacationCoefficient } from './calendar.js';
import catalogDt from './data.json';
console.log('Данные загружены через import:', catalogDt);
if (!localStorage.getItem('catalogDt')) {
    localStorage.setItem('catalogDt', JSON.stringify(catalogDt));
}


const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const openButton = document.getElementById('open-button');
const toggleButton = document.getElementById('toggle-button');
const sidePanel = document.getElementById('side-panel');

const projectsContainer = document.getElementById('projects-table-container');
const employeeContainer = document.getElementById('employees-table-container');

function getData() {
    return JSON.parse(localStorage.getItem('catalogDt'))
}
function saveData(data) {
    localStorage.setItem('catalogDt', JSON.stringify(data));
}

function addProject(newProject) {
    let periodKey = getPeriodKey();
    let newCatalog = getData();
    if (!newCatalog.monthlyData[periodKey]) {
        newCatalog.monthlyData[periodKey] = { employees: [], projects: [] };
    }
    newCatalog.monthlyData[periodKey].projects.push(newProject);
    saveData(newCatalog);
    updateDashboard();
}
function addEmployee(newEmployee) {
    let periodKey = getPeriodKey();
    let newCatalog = getData();
    if (!newCatalog.monthlyData[periodKey]) {
        newCatalog.monthlyData[periodKey] = { employees: [], projects: [] };
    }
    newCatalog.monthlyData[periodKey].employees.push(newEmployee);
    saveData(newCatalog);
    updateDashboard();
}

function deleteEmployee(employeeId) {
    let periodKey = getPeriodKey();
    let newCatalog = getData();

    const newArray = newCatalog.monthlyData[periodKey].employees.filter(emp => emp.id !== employeeId);
    newCatalog.monthlyData[periodKey].employees = newArray;

    newCatalog.monthlyData[periodKey].projects.forEach(proj => {
        proj.assignedEmployees = proj.assignedEmployees.filter(empId => empId !== employeeId);
    });

    saveData(newCatalog);
    updateDashboard();
}

function deleteProject(projectId) {
    let periodKey = getPeriodKey();
    let newCatalog = getData();
    const newArray = newCatalog.monthlyData[periodKey].projects.filter(proj => proj.id !== projectId);
    newCatalog.monthlyData[periodKey].projects = newArray;

    newCatalog.monthlyData[periodKey].employees.forEach(emp => {
        emp.assignments = emp.assignments.filter(projId => projId !== projectId);
    })
    saveData(newCatalog);
    updateDashboard();
}

function assignEmployeeToProject(employeeId, projectId, assignedCapacityCoef, projectFitCoef) {
    let periodKey = getPeriodKey();
    let newCatalog = getData();
    const NeededEmp = newCatalog.monthlyData[periodKey].employees.find(emp => emp.id === employeeId);
    const NeededProj = newCatalog.monthlyData[periodKey].projects.find(proj => proj.id === projectId);
    NeededProj.assignedEmployees.push(employeeId);
    NeededEmp.assignments.push({ projectId: projectId, AssignedCapacity: assignedCapacityCoef, ProjectFit: projectFitCoef });
    saveData(newCatalog);
    updateDashboard();
}

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
const seedDataBtn = document.getElementById('seed-data-btn');

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

seedDataBtn.addEventListener('click', (e) => {
    getSeedData();
    document.getElementById('seed-data-popup-back').classList.remove('hidden');
    document.getElementById('seed-data-popup-back').style.display = "inline";
})

const state = {
    selectedYear: '2026',
    selectedMonth: '2', // March
};
const getPeriodKey = () => `${state.selectedYear}-${state.selectedMonth}`;
let periodKey = getPeriodKey();
let currentData = getData().monthlyData[periodKey];
let activeAssignmentTrigger = null;

function repositionAssignmentPopup() {
    const popup = document.getElementById('assignment-popup');
    if (!popup || popup.classList.contains('hidden') || !activeAssignmentTrigger) return;

    const rect = activeAssignmentTrigger.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let top = rect.bottom + 5;
    let left = rect.left;

    const popupHeight = popup.offsetHeight;
    const popupWidth = popup.offsetWidth;

    if (top + popupHeight > viewportHeight) {
        top = rect.top - popupHeight - 5;
    }

    if (left + popupWidth > viewportWidth) {
        left = viewportWidth - popupWidth - 20;
    }

    top = Math.max(10, top);
    left = Math.max(10, left);

    popup.style.top = `${top}px`;
    popup.style.left = `${left}px`;
}

window.addEventListener('resize', repositionAssignmentPopup);
document.addEventListener('scroll', (e) => {
    if (e.target.id === 'main-content' || e.target.closest('#main-content')) {
        repositionAssignmentPopup();
    }
}, true);

function updateDashboard() {
    periodKey = getPeriodKey();
    currentData = getData().monthlyData[periodKey];

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
    const totalProfit = countProjectProfitTotal(state.selectedYear, state.selectedMonth);
    const totalBenchCost = countBenchCost(state.selectedYear, state.selectedMonth);

    totalIncome.innerHTML = `Total Estimated Income: $${totalProfit.toLocaleString()} (Bench Cost: $${totalBenchCost.toLocaleString()})   `;

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
                ${data.map(proj => {
        const usedCap = getUsedEffectiveCapacity(state.selectedYear, state.selectedMonth, proj.id);
        const totalCap = proj.EmployeeCapacity;
        const isOverCap = usedCap > totalCap;
        const estimatedIncome = countProjectProfit(state.selectedYear, state.selectedMonth, proj.id)

        return `
                    <tr>
                        <td>${proj.companyName}</td>
                        <td>${proj.projectname}</td>
                        <td>$ ${Number(proj.budjet).toLocaleString()}</td>
                        <td class="${isOverCap ? 'text-red-500 font-bold' : ''}">
                            ${usedCap.toFixed(1)} / ${totalCap}
                        </td>
                        <td>
                            <button class="show-btn btn" data-project-id="${proj.id}">Show Assigned Employees (${proj.assignedEmployees.length})</button>
                        </td>
                        <td>$ ${estimatedIncome.toFixed(2)}</td>
                        <td>
                             <button class="delete-btn btn" data-id="${proj.id}">Delete</button>
                        </td>
                    </tr>
                `}).join('')}
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
                ${data.map(emp => {
        let estimatedPayment = 0;
        let projectedIncome = 0;

        if (!emp.assignments || emp.assignments.length === 0) {
            estimatedPayment = emp.salary * 0.5;
            projectedIncome = -estimatedPayment;
        } else {
            emp.assignments.forEach(a => {
                estimatedPayment += countEmployeeCost(state.selectedYear, state.selectedMonth, emp.id, a.projectId);
                projectedIncome += getEmployeeProfit(state.selectedYear, state.selectedMonth, emp.id, a.projectId, emp.vacation);
            });
        }

        const projectCount = emp.assignments.filter(a => a.projectId).length;
        return `
                    <tr>
                        <td>${emp.name}</td>
                        <td>${emp.surname}</td>
                        <td>${calculateAge(emp.dateofbirth)}</td>
                        <td>${emp.position}</td>
                        <td>$ ${emp.salary.toLocaleString()}</td>
                        <td>$ ${estimatedPayment.toFixed(2)}</td>
                        <td>
                            <button class="show-assignments-btn btn" data-employee-id="${emp.id}">Show Projects (${projectCount})</button>
                        </td>
                        <td>$ ${projectedIncome.toFixed(2)}</td>
                        <td>
                            <button class="vacation-btn btn" data-employee-id="${emp.id}">Availability</button>
                            <button class="assignment-btn btn" data-employee-id="${emp.id}">Assign</button>
                            <button class="delete-emp-btn btn" data-employee-id="${emp.id}">Delete</button>
                        </td>
                    </tr>
        `}).join('')}
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
    if (event.target.classList.contains('delete-btn')) {
        const projectId = Number(event.target.getAttribute('data-id'));
        let periodKey = getPeriodKey();
        let newCatalog = getData();
        const project = newCatalog.monthlyData[periodKey].projects.find(e => e.id === projectId);
        const projectName = project ? project.projectname : '';
        if (confirm(`Are you sure you want to delete ${projectName}? This will unassign all employees from this project.`)) {
            deleteProject(projectId);
        }
    }
});

function showProjectStaff(projectId) {
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

    let periodKey = getPeriodKey();
    let currentData = getData();
    const targetProject = currentData.monthlyData[periodKey].projects.find(p => p.id === projectId);
    header.innerHTML = `<h3>Assigned Employees on ${targetProject.projectname}</h3> <button class="close-popup-btn btn" onclick="this.closest('#popup-details').style.display='none'">×</button>`;

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
            let vacationDates = emp.vacation;
            const effective = getEffectiveCapacity(state.selectedYear, state.selectedMonth, emp.id, projectId, vacationDates).toFixed(2);
            const revenue = countEmployeeRevenue(state.selectedYear, state.selectedMonth, emp.id, projectId, vacationDates).toFixed(2);
            const empCost = countEmployeeCost(state.selectedYear, state.selectedMonth, emp.id, projectId).toFixed(2);
            const profit = (revenue - empCost).toFixed(2);

            return `
                            <tr>
                                <td>${emp.name} ${emp.surname}</td>
                                <td>${job ? job.AssignedCapacity : '0'}</td>
                                <td>${job ? job.ProjectFit : '0'}</td>
                                <td>${emp ? emp.vacation.length : '0'} days </td>
                                <td>${effective}</td>
                                <td>${revenue} $</td>
                                <td>${empCost} $</td>
                                <td>${profit} $</td>
                                <td>
                                <button class="edit-btn btn" data-employee-id="${emp.id}" data-project-id="${projectId}" data-source="project">Edit assignments</button >
                                <button class="unassign-btn btn" data-project-id="${projectId}" data-employee-id="${emp.id}">Unassign</button>
                                </td>
                            </tr>
                        `;
        }).join('')}
                </tbody>
            </table>
        `;
        content.innerHTML = tableHtml;
    }

    popup.style.display = 'flex';
}


employeeContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('show-assignments-btn')) {
        const employeeId = event.target.getAttribute('data-employee-id');
        showEmployeeProjects(employeeId);
    }
    if (event.target.classList.contains('vacation-btn')) {
        const employeeId = event.target.getAttribute('data-employee-id');
        const eId = Number(employeeId);
        const employee = currentData.employees.find(e => e.id === eId);
        if (!employee) return;
        const employeeFullName = employee.name + ' ' + employee.surname;
        createCalendar(state.selectedYear, state.selectedMonth, employee.vacation, employeeFullName);
        calendarWrapper.classList.remove('hidden');
        calendarWrapper.style.display = 'flex';
    };
    if (event.target.classList.contains('delete-emp-btn')) {
        const employeeId = Number(event.target.getAttribute('data-employee-id'));
        let periodKey = getPeriodKey();
        let newCatalog = getData();
        const employee = newCatalog.monthlyData[periodKey].employees.find(e => e.id === employeeId);
        const employeeName = employee ? employee.name + ' ' + employee.surname : '';
        if (confirm(`Are you sure you want to delete ${employeeName}?`)) {
            deleteEmployee(employeeId);
        }
    }

    if (event.target.classList.contains('assignment-btn')) {
        const employeeId = Number(event.target.getAttribute('data-employee-id'));
        activeAssignmentTrigger = event.target;
        openAssignmentPopup(employeeId);
        setTimeout(repositionAssignmentPopup, 0);
    }
})

function openAssignmentPopup(employeeId) {
    document.getElementById('assignment-popup').classList.remove('hidden');
    document.querySelector('.capacity-status').classList.remove('hidden');
    document.getElementById('select-project').classList.remove('hidden');
    document.getElementById('select-label').classList.remove('hidden');
    document.querySelector('.project-info').classList.remove('hidden');
    document.querySelector('.apply-assignment').classList.remove('hidden');
    document.querySelector('.save-assignment').classList.add('hidden');
    document.getElementById('popup-header-assign').innerHTML = ``;
    document.getElementById('popup-header-p').innerHTML = ``;
    const applyBtn = document.querySelector('.apply-assignment');

    applyBtn.setAttribute('data-employee-id', employeeId);
    const selectElement = document.getElementById('select-project');
    selectElement.innerHTML = '<option value="">Select a project</option>';
    let periodKey = getPeriodKey();
    let catalog = getData();
    let currentProjects = catalog.monthlyData[periodKey].projects;
    let allEmployees = catalog.monthlyData[periodKey].employees;

    currentProjects.forEach(proj => {
        const option = document.createElement('option');
        option.value = proj.id;
        const projectAssigned = allEmployees.reduce((sum, emp) => {
            if (!emp.assignments) return sum;
            const assignment = emp.assignments.find(a => Number(a.projectId) === proj.id);
            if (assignment) {
                return sum + (Number(assignment.AssignedCapacity) * Number(assignment.ProjectFit));
            }
            return sum;
        }, 0);

        const available = Number(proj.EmployeeCapacity - projectAssigned);

        option.textContent = `${proj.projectname} (Available: ${available.toFixed(2)})`;
        selectElement.appendChild(option);
    });

    const employee = catalog.monthlyData[periodKey].employees.find(e => e.id === employeeId);
    const currentCapacity = employee.assignments.reduce((sum, assignment) => {
        return sum + (assignment.AssignedCapacity ? Number(assignment.AssignedCapacity) : 0);
    }, 0);

    const popupHeader = document.getElementById('popup-header-assign');
    popupHeader.innerHTML = `Assign ${employee.name} ${employee.surname}`;

    const capacityInput = document.getElementById('capacity-range');
    const fitInput = document.getElementById('projectfit-range');
    const validationMessageEl = document.querySelector('.validation-message');

    const CapacityStatus = document.querySelector('.current-capacity');
    const AvailableCapacity = document.querySelector('.available-capacity');
    CapacityStatus.innerHTML = `Current Capacity: ${currentCapacity.toFixed(2)}`;
    AvailableCapacity.innerHTML = `Available Capacity: ${(1.0 - currentCapacity).toFixed(2)}`;

    validationMessageEl.textContent = '';
    validationMessageEl.classList.remove('error', 'warning');

    capacityInput.oninput = updateCalculations;
    fitInput.oninput = updateCalculations;
    selectElement.onchange = updateCalculations;

    updateCalculations();
}

function updateCalculations() {
    const capacityInput = document.getElementById('capacity-range');
    const fitInput = document.getElementById('projectfit-range');
    const selectElement = document.getElementById('select-project');
    const validationMessageEl = document.querySelector('.validation-message');
    const saveBtn = document.querySelector('.save-assignment');
    const applyBtn = document.querySelector('.apply-assignment');

    if (!capacityInput || !fitInput) return;

    const allocatedCapacity = Number(capacityInput.value);
    const projectFit = Number(fitInput.value);

    const capDisplay = document.getElementById('capacity-value-display');
    if (capDisplay) capDisplay.textContent = allocatedCapacity.toFixed(2);

    const fitDisplay = document.getElementById('fit-value-display');
    if (fitDisplay) fitDisplay.textContent = projectFit.toFixed(2);

    const isEditMode = !saveBtn.classList.contains('hidden');
    const employeeId = Number(isEditMode ? saveBtn.getAttribute('data-employee-id') : applyBtn.getAttribute('data-employee-id'));
    const projectId = Number(isEditMode ? saveBtn.getAttribute('data-project-id') : selectElement.value);

    if (!employeeId) return;

    let periodKey = getPeriodKey();
    let catalog = getData();
    let currentProjects = catalog.monthlyData[periodKey].projects;
    let allEmployees = catalog.monthlyData[periodKey].employees;
    const employee = allEmployees.find(e => e.id === employeeId);

    // Calculate other assignments capacity
    const otherAssignmentsCapacity = employee.assignments.reduce((sum, a) => {
        if (isEditMode && Number(a.projectId) === projectId) return sum;
        return sum + (Number(a.AssignedCapacity) || 0);
    }, 0);

    const newTotalCapacity = otherAssignmentsCapacity + allocatedCapacity;

    if (newTotalCapacity > 1.5) {
        validationMessageEl.textContent = `Error: Total capacity would be ${newTotalCapacity.toFixed(2)}. Maximum allowed is 1.5.`;
        validationMessageEl.className = 'validation-message error';
    } else if (newTotalCapacity > 1.0) {
        validationMessageEl.textContent = `Warning: Employee is over-capacity (Total: ${newTotalCapacity.toFixed(2)}).`;
        validationMessageEl.className = 'validation-message warning';
    } else {
        validationMessageEl.textContent = `Total expected capacity: ${newTotalCapacity.toFixed(2)}`;
        validationMessageEl.className = 'validation-message';
    }

    if (!projectId) return;

    const effectiveCapacity = allocatedCapacity * projectFit;
    let currentProjectAssigned = 0;
    const selectedProject = currentProjects.find(p => p.id === projectId);
    const projectTotalRequired = selectedProject ? selectedProject.EmployeeCapacity : 0;

    currentProjectAssigned = allEmployees.reduce((totalSum, emp) => {
        if (!emp.assignments) return totalSum;
        const assignment = emp.assignments.find(a => Number(a.projectId) === projectId);
        if (assignment) {
            if (isEditMode && emp.id === employeeId) return totalSum;
            return totalSum + (Number(assignment.AssignedCapacity) * Number(assignment.ProjectFit));
        }
        return totalSum;
    }, 0);

    const afterAssignmentValue = currentProjectAssigned + effectiveCapacity;

    const effectiveCap = document.querySelector('.effective-capacity');
    if (effectiveCap) effectiveCap.innerHTML = effectiveCapacity.toFixed(2);

    const usedCapacityHTML = document.querySelector('.used-capacity');
    if (usedCapacityHTML) usedCapacityHTML.innerHTML = currentProjectAssigned.toFixed(2);

    const projectCapacityHTML = document.querySelector('.total-capacity');
    if (projectCapacityHTML) projectCapacityHTML.innerHTML = projectTotalRequired;

    const afterAssignmentHTML = document.querySelector('.target-capacity');
    if (afterAssignmentHTML) afterAssignmentHTML.innerHTML = `${afterAssignmentValue.toFixed(2)} / ${projectTotalRequired}`;
}


function openEditAssignmentPopup(employeeId, projectId, source) {
    const eId = Number(employeeId);
    const employee = currentData.employees.find(e => e.id === eId);
    if (!employee) return;

    const currentAssignment = employee.assignments.find(a => Number(a.projectId) === Number(projectId));

    const fitInput = document.getElementById('projectfit-range');
    const capacityInput = document.getElementById('capacity-range');
    fitInput.value = currentAssignment.ProjectFit;
    capacityInput.value = currentAssignment.AssignedCapacity;

    document.getElementById('fit-value-display').textContent = Number(fitInput.value).toFixed(2);
    document.getElementById('capacity-value-display').textContent = Number(capacityInput.value).toFixed(2);

    fitInput.oninput = updateCalculations;
    capacityInput.oninput = updateCalculations;

    const saveBtn = document.querySelector('.save-assignment');
    saveBtn.setAttribute('data-employee-id', employeeId);
    saveBtn.setAttribute('data-project-id', projectId);
    saveBtn.setAttribute('data-context', source || '');

    updateCalculations();
}

function saveEditAssignment() {
    const saveBtn = document.querySelector('.save-assignment');
    const empId = Number(saveBtn.getAttribute('data-employee-id'));
    const projId = Number(saveBtn.getAttribute('data-project-id'));

    let periodKey = getPeriodKey();
    let catalog = getData();
    const employee = catalog.monthlyData[periodKey].employees.find(e => e.id === empId);
    const currentAssignment = employee.assignments.find(a => Number(a.projectId) === projId);

    const newCapacity = document.getElementById('capacity-range').value;
    const newFit = document.getElementById('projectfit-range').value;

    currentAssignment.AssignedCapacity = newCapacity;
    currentAssignment.ProjectFit = newFit;

    saveData(catalog);
    updateDashboard();

    document.getElementById('assignment-popup').classList.add('hidden');
    const context = saveBtn.getAttribute('data-context');
    if (context === 'employee') {
        showEmployeeProjects(empId);
    } else {
        showProjectStaff(projId);
    }
}

function unassignEmployee(employeeId, projectId) {
    let periodKey = getPeriodKey();
    let catalog = getData();
    const employee = catalog.monthlyData[periodKey].employees.find(e => e.id === employeeId);
    const project = catalog.monthlyData[periodKey].projects.find(p => p.id === projectId);
    employee.assignments = employee.assignments.filter(a => Number(a.projectId) !== Number(projectId));
    project.assignedEmployees = project.assignedEmployees.filter(eId => Number(eId) !== Number(employeeId));
    saveData(catalog);
    showEmployeeProjects(employeeId, projectId);
    updateDashboard();
}
const popupContainer = document.getElementById('popup-details');
popupContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('edit-btn')) {
        event.preventDefault();
        const employeeId = Number(event.target.getAttribute('data-employee-id'));
        const projectId = Number(event.target.getAttribute('data-project-id'));
        const source = event.target.getAttribute('data-source');
        const employee = currentData.employees.find(e => e.id === employeeId);
        const projectName = currentData.projects.find(proj => proj.id === projectId);
        document.getElementById('assignment-popup').classList.remove('hidden');
        activeAssignmentTrigger = event.target;
        setTimeout(repositionAssignmentPopup, 0);

        document.querySelector('.capacity-status').classList.add('hidden');
        document.getElementById('select-project').classList.add('hidden');
        document.getElementById('select-label').classList.add('hidden');
        document.querySelector('.project-info').classList.add('hidden');
        document.querySelector('.apply-assignment').classList.add('hidden');
        document.querySelector('.save-assignment').classList.remove('hidden');
        document.getElementById('popup-header-assign').innerHTML = `Edit Assignment`;
        document.getElementById('popup-header-p').innerHTML = `<strong>${employee.name} ${employee.surname}</strong> on <strong>${projectName.projectname}</strong>`;

        openEditAssignmentPopup(employeeId, projectId, source);
    }
    if (event.target.classList.contains('unassign-btn')) {
        const employeeId = Number(event.target.getAttribute('data-employee-id'));
        const projectId = Number(event.target.getAttribute('data-project-id'));
        const employee = currentData.employees.find(e => e.id === employeeId);
        const projectName = currentData.projects.find(proj => proj.id === projectId);
        const job = employee.assignments.find(a => a.projectId === projectId);
        const assignedCap = job ? Number(job.AssignedCapacity) : 0;
        const empCost = countEmployeeCost(state.selectedYear, state.selectedMonth, employee.id, projectId).toFixed(2);
        const projectedIncome = getEmployeeProfit(state.selectedYear, state.selectedMonth, employee.id, projectId, employee.vacation);
        const usedCap = getUsedEffectiveCapacity(state.selectedYear, state.selectedMonth, projectId);
        const totalCap = projectName.EmployeeCapacity;
        const afterCap = usedCap - assignedCap;

        document.querySelector('.unassignment-popup-overlay').classList.remove('hidden');
        document.querySelector('.unassign-message').innerHTML = `You want to unassign <strong>${employee.name} ${employee.surname}</strong> (${assignedCap.toFixed(2)} capacity) from <strong>${projectName.projectname}</strong>?`
        document.getElementById('unassign-capacity').innerHTML = `${assignedCap.toFixed(2)}`;
        document.getElementById('unassign-salary-share').innerHTML = `$ ${empCost}`;
        document.getElementById('unassign-income').innerHTML = `$ ${projectedIncome.toFixed(2)}`;
        document.getElementById('unassign-project-capacity').innerHTML = `${usedCap.toFixed(2)} / ${totalCap}`;
        document.getElementById('unassign-after-capacity').innerHTML = `${afterCap.toFixed(2)} / ${totalCap}`;



        const UnassignBtn = document.querySelector('.popup-confirm-unassign');
        UnassignBtn.setAttribute('data-employee-id', employeeId);
        UnassignBtn.setAttribute('data-project-id', projectId);

    }
});

const seedDataPopup = document.getElementById('seed-data-popup-back');
seedDataPopup.addEventListener('click', (e) => {
    if (e.target.classList.contains('close-popup-btn')) {
        document.getElementById('seed-data-popup-back').classList.add('hidden');
    }
    if (e.target.classList.contains('btn-seed-data')) {
        e.preventDefault()
        const key = e.target.getAttribute('data-copy-month');
        copySeedData(key)
    }
})

function getSeedData() {
    let periodKey = getPeriodKey();
    let catalog = getData();
    const allMonths = Object.keys(catalog.monthlyData);
    let leftMonths = allMonths.filter(key => key !== periodKey);
    let currentMonth = state.selectedMonth;
    let currentYear = state.selectedYear;
    const content = document.querySelector('.seed-popup-content');
    content.innerHTML = `
    <p>Select a month to copy its data to the current month (${monthNames[currentMonth]} ${currentYear})</p>
    <table id="popup-table">
        <thead>
            <tr>
                 <th>Year</th>
                 <th>Month</th>
                 <th>Projects</th>
                 <th>Employees</th>
                 <th>Total Est. Income</th>
                 <th>Action</th>
            </tr>
        </thead>
        <tbody>
        ${leftMonths.map(key => {
        const monthData = catalog.monthlyData[key];
        const project = monthData.projects;
        const employee = monthData.employees;
        const year = key.split('-')[0];
        const month = key.split('-')[1];

        const originalCurrentData = currentData;
        currentData = monthData;
        const totalIncome = countProjectProfitTotal(year, month);
        currentData = originalCurrentData;
        return `<tr>
        <td>${year}</td>
                <td>${monthNames[month]}</td>
                <td>${project.length}</td>
                <td>${employee.length}</td>
                <td>$${totalIncome.toFixed(2)}</td>
                <td><button class="btn btn-seed-data" data-copy-month = "${key}" data-current-month = "${periodKey}">Seed</button></td>
        </tr>`;
    }).join('')}
        </tbody>
    </table>
`;
    return periodKey;
}


function copySeedData(sourceKey) {
    let periodKey = getPeriodKey();
    let catalog = getData();

    let copiedData = JSON.parse(JSON.stringify(catalog.monthlyData[sourceKey]));

    copiedData.employees.forEach(emp => {
        emp.vacation = [];
    });

    catalog.monthlyData[periodKey] = copiedData;

    saveData(catalog);
    updateDashboard();
    document.getElementById('seed-data-popup-back').classList.add('hidden');
}

const unassignmentPopup = document.querySelector('.unassignment-popup-overlay');
unassignmentPopup.addEventListener('click', (e) => {
    if (e.target.classList.contains('popup-cancel')) {
        document.querySelector('.unassignment-popup-overlay').classList.add('hidden');
    }
    if (e.target.classList.contains('popup-confirm-unassign')) {
        const employeeId = Number(e.target.getAttribute('data-employee-id'));
        const projectId = Number(e.target.getAttribute('data-project-id'));
        unassignEmployee(employeeId, projectId);
        document.querySelector('.unassignment-popup-overlay').classList.add('hidden');
    }
})


const SaveAssignmentBtn = document.querySelector('.save-assignment');
SaveAssignmentBtn.addEventListener('click', (e) => {
    e.preventDefault();
    saveEditAssignment();
})



function showEmployeeProjects(employeeId) {
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
            let vacationDates = employee.vacation;
            const effective = getEffectiveCapacity(state.selectedYear, state.selectedMonth, employee.id, proj.id, vacationDates).toFixed(2);
            const revenue = countEmployeeRevenue(state.selectedYear, state.selectedMonth, employee.id, proj.id, vacationDates).toFixed(2);
            const empCost = countEmployeeCost(state.selectedYear, state.selectedMonth, employee.id, proj.id).toFixed(2);
            const profit = (revenue - empCost).toFixed(2);
            return `
                            <tr>
                                <td>${proj.projectname}</td>
                                <td>${job ? job.AssignedCapacity : '0'}</td>
                                <td>${job ? job.ProjectFit : '0'}</td>
                                <td> ${employee ? employee.vacation.length : '0'} days </td>
                                <td> ${effective}</td>
                                <td> ${revenue} $</td>
                                <td>${empCost} $</td>
                                <td>${profit} $</td>
                                <td>
                                    <button class="edit-btn btn" data-employee-id="${employee.id}" data-project-id="${proj.id}" data-source="employee">Edit assignments</button >
                                    <button class="unassign-btn btn" data-project-id="${proj.id}" data-employee-id="${employee.id}">Unassign</button>
                                </td>
                            </tr>
                        `;
        }).join('')}
                </tbody>
            </table>
        `;
    }
    popup.style.display = 'flex';
}

function countAssignedCapacity(year, month, employeeId, projectId) {
    const employee = currentData.employees.find(e => e.id === Number(employeeId));

    if (!employee || !employee.assignments) return 0;

    const job = employee.assignments.find(a => Number(a.projectId) === Number(projectId));
    if (!job) return 0;
    return Number(job.AssignedCapacity) || 0;
}

function countProjectFit(year, month, employeeId, projectId) {
    const employee = currentData.employees.find(e => e.id === Number(employeeId));

    if (!employee || !employee.assignments) return 0;

    const job = employee.assignments.find(a => Number(a.projectId) === Number(projectId));
    if (!job) return 0;
    return Number(job.ProjectFit) || 0;
}


//$$effectiveCapacity = AssignedCapacity x ProjectFit x vacationCoefficient$$

function getEffectiveCapacity(year, month, employeeId, projectId, vacationDates) {
    const assignedCapacity = countAssignedCapacity(year, month, employeeId, projectId);
    const projectFit = countProjectFit(year, month, employeeId, projectId);
    const vacationCoefficient = getVacationCoefficient(year, month, vacationDates);
    return assignedCapacity * projectFit * vacationCoefficient;
}

//usedEffectiveCapacity = sum of all employees' effective capacities
function getUsedEffectiveCapacity(year, month, projectId) {
    return currentData.employees.reduce((sum, emp) => {
        if (!emp.assignments || !emp.assignments.some(a => Number(a.projectId) === Number(projectId))) return sum;
        return sum + getEffectiveCapacity(year, month, emp.id, projectId, emp.vacation);
    }, 0);
}

//capacityForRevenue = max(projectCapacity, usedEffectiveCapacity)
function getCapacityForRevenue(year, month, projectId) {
    const project = currentData.projects.find(p => p.id === Number(projectId));
    if (!project) return 0;
    const projectCapacity = project.EmployeeCapacity;
    const usedEffectiveCapacity = getUsedEffectiveCapacity(year, month, projectId);
    return Math.max(projectCapacity, usedEffectiveCapacity);
}

//Revenue per effective capacity = budget ÷ capacity for revenue
function countRevenuePerCapacity(year, month, projectId) {
    const project = currentData.projects.find(p => p.id === Number(projectId));
    if (!project) return 0;
    const budget = project.budjet;
    const capacityForRevenue = getCapacityForRevenue(year, month, projectId);
    return capacityForRevenue > 0 ? budget / capacityForRevenue : 0;
}

//projectProfit = projectRevenue - projectCosts
function countProjectProfit(year, month, projectId) {
    const revenuePerCapacity = countRevenuePerCapacity(year, month, projectId);
    const usedEffectiveCapacity = getUsedEffectiveCapacity(year, month, projectId);
    const projectRevenue = revenuePerCapacity * usedEffectiveCapacity;

    const projectCosts = currentData.employees.reduce((sum, emp) => {
        if (!emp.assignments) return sum;

        const job = emp.assignments.find(a => Number(a.projectId) === Number(projectId));
        if (job) {
            return sum + countEmployeeCost(year, month, emp.id, projectId);
        }
        return sum;
    }, 0);

    return projectRevenue - projectCosts;
}

// Total Estimated Income = Sum of all projects' profit - bench payments
function countProjectProfitTotal(year, month) {
    const totalProjectsProfit = currentData.projects.reduce((sum, proj) => {
        const profit = countProjectProfit(year, month, proj.id);
        return sum + profit;
    }, 0);

    const totalBenchCost = countBenchCost(year, month);

    return totalProjectsProfit - totalBenchCost;
}


//employeeProfit = sum of profits from all assignments
function getEmployeeProfit(year, month, employeeId, projectId, vacationDates) {
    const revenue = countEmployeeRevenue(year, month, employeeId, projectId, vacationDates);
    const cost = countEmployeeCost(year, month, employeeId, projectId);
    return revenue - cost;
}


//employeeRevenue = revenuePerEffectiveCapacity × employeeEffectiveCapacity
function countEmployeeRevenue(year, month, employeeId, projectId, vacationDates) {
    const effectiveCapacity = getEffectiveCapacity(year, month, employeeId, projectId, vacationDates);
    const revenuePerCapacity = countRevenuePerCapacity(year, month, projectId);
    return revenuePerCapacity * effectiveCapacity;
}

//employeeCost = salary × max(0.5, assignedCapacity)
function countEmployeeCost(year, month, employeeId, projectId) {
    const employee = currentData.employees.find(e => e.id === Number(employeeId));
    if (!employee) return 0;
    const salary = employee.salary;
    const assignedCapacity = countAssignedCapacity(year, month, employeeId, projectId);
    return salary * Math.max(0.5, assignedCapacity);
}

//benchCost = salary × 0.5  // For unassigned employees
function countBenchCost(year, month) {
    const benchEmp = currentData.employees.filter(e => !e.assignments || e.assignments.length === 0);
    return benchEmp.reduce((sum, emp) => sum + (emp.salary * 0.5), 0);
}

function getDay(date) {
    let day = date.getDay();
    if (day == 0) day = 7;
    return day - 1;
}
const calendarWrapper = document.getElementById('calendar-wrapper');

calendarWrapper.addEventListener('click', (event) => {
    if (event.target.classList.contains('close-calendar-btn') || event.target.id === 'calendar-wrapper') {
        document.getElementById('calendar-header').innerHTML = '';
        document.getElementById('calendar-grid').innerHTML = '';
        calendarWrapper.classList.add('hidden');
    }
});

const addEmplForm = document.querySelector('.add-new-employee-container .contact-form-in');
addEmplForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!addEmplForm.checkValidity()) {
        return;
    }
    const newEmployee = {
        id: Date.now(),
        name: document.getElementById('employee-name').value,
        surname: document.getElementById('employee-surname').value,
        dateofbirth: document.getElementById('dob').value,
        position: document.getElementById('position').value,
        salary: Number(document.getElementById('salary').value),
        vacation: [],
        assignments: [],
    }
    addEmployee(newEmployee);
    addEmplForm.reset();
    addEmployeeForm.classList.add('hidden')
})

const applyAssignmentBtn = document.querySelector('.apply-assignment');
applyAssignmentBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const employeeId = Number(e.target.getAttribute('data-employee-id'));
    const projectId = Number(document.getElementById('select-project').value);
    const assignedCapacityCoef = Number(document.getElementById('capacity-range').value);
    const projectFitCoef = Number(document.getElementById('projectfit-range').value);
    let periodKey = getPeriodKey();
    let currentData = getData();
    const employee = currentData.monthlyData[periodKey].employees.find(e => e.id === employeeId);

    const currentCapacity = employee.assignments.reduce((sum, assignment) => {
        return sum + (assignment.AssignedCapacity ? Number(assignment.AssignedCapacity) : 0);
    }, 0);

    const newTotalCapacity = currentCapacity + assignedCapacityCoef;

    if (newTotalCapacity > 1.5) {
        return;
    }
    assignEmployeeToProject(employeeId, projectId, assignedCapacityCoef, projectFitCoef);
    document.getElementById('assignment-popup').classList.add('hidden');
})

const cancelAssignmentBtn = document.querySelector('.cancel-assignment');
cancelAssignmentBtn.addEventListener('click', (e) => {
    document.getElementById('assignment-popup').classList.add('hidden');
    activeAssignmentTrigger = null;
})

const addPorjForm = document.querySelector('.add-new-project-container .contact-form-in');
addPorjForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!addPorjForm.checkValidity()) {
        return;
    }
    const newProject = {
        id: Date.now(),
        companyName: document.getElementById('project-name').value,
        projectname: document.getElementById('company-name').value,
        budjet: Number(document.getElementById('budget').value),
        EmployeeCapacity: document.getElementById('capacity').value,
        assignedEmployees: [],
    }
    addProject(newProject)
    addPorjForm.reset();
    addProjectForm.classList.add('hidden')
})











document.addEventListener('click', (e) => {
    const assignPopup = document.getElementById('assignment-popup');
    const detailsPopup = document.getElementById('popup-details');
    const unassignPopup = document.querySelector('.unassignment-popup-overlay');

    if (assignPopup && !assignPopup.classList.contains('hidden')) {
        const isTrigger = e.target.classList.contains('assignment-btn') || e.target.classList.contains('edit-btn');
        if (!assignPopup.contains(e.target) && !isTrigger) {
            assignPopup.classList.add('hidden');
            if (typeof activeAssignmentTrigger !== 'undefined') activeAssignmentTrigger = null;
        }
    }

    if (detailsPopup && detailsPopup.style.display === 'flex') {
        const isTrigger = e.target.classList.contains('show-btn') || e.target.classList.contains('show-assignments-btn');

        const isInsideChildPopup = (assignPopup && assignPopup.contains(e.target)) ||
            (unassignPopup && unassignPopup.contains(e.target));

        if (!detailsPopup.contains(e.target) && !isTrigger && !isInsideChildPopup) {
            detailsPopup.style.display = 'none';
        }
    }

    if (unassignPopup && !unassignPopup.classList.contains('hidden')) {
        if (e.target === unassignPopup) {
            unassignPopup.classList.add('hidden');
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('catalogDt')) {
        localStorage.setItem('catalogDt', JSON.stringify(catalogDt));
    }
    updateDashboard();
});

export { getData, updateDashboard, renderEmployeesTable, renderProjectsTable, getPeriodKey };