import './style.css';
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
const employeeContainer = document.getElementById('table-container');

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
let periodKey = getPeriodKey();
let currentData = getData().monthlyData[periodKey];

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
                            <button class="show-btn btn" data-project-id="${proj.id}">Show Assigned Employees</button>
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
            <button class="assignment-btn btn" data-employee-id="${emp.id}">Assign</button>
            <button class="delete-emp-btn btn" data-employee-id="${emp.id}">Delete</button>
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
                                <button class="edit-btn btn" data-employee-id="${emp.id}" data-project-id="${projectId}" data-source="project">Edit assignments</button >
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
        const eId = Number(employeeId);
        const employee = currentData.employees.find(e => e.id === eId);
        if (!employee) return;
        const employeeFullName = employee.name + ' ' + employee.surname;
        createCalendar(state.selectedYear, state.selectedMonth, employee.vacation, employeeFullName);
        calendarWrapper.style.display = 'block';
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
        openAssignmentPopup(employeeId);
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
                const cap = assignment.AssignedCapacity !== undefined ? assignment.AssignedCapacity : assignment.assignedCapacity;
                const fit = assignment.ProjectFit !== undefined ? assignment.ProjectFit : assignment.projectFit;
                return sum + (Number(cap) * Number(fit));
            }
            return sum;
        }, 0);

        const available = Number(proj.EmployeeCapacity - projectAssigned);

        option.textContent = `${proj.projectname} (Available: ${available.toFixed(2)})`;
        selectElement.appendChild(option);
    });

    const employee = catalog.monthlyData[periodKey].employees.find(e => e.id === employeeId);
    const currentCapacity = employee.assignments.reduce((sum, assignment) => {
        const cap = assignment.AssignedCapacity !== undefined ? assignment.AssignedCapacity : assignment.assignedCapacity;
        return sum + (cap ? Number(cap) : 0);
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

    function updateCalculations() {
        const allocatedCapacity = Number(capacityInput.value);
        const projectFit = Number(fitInput.value);

        const capDisplay = document.getElementById('capacity-value-display');
        if (capDisplay) capDisplay.textContent = allocatedCapacity.toFixed(1);

        const fitDisplay = document.getElementById('fit-value-display');
        if (fitDisplay) fitDisplay.textContent = projectFit.toFixed(1);

        const newTotalCapacity = currentCapacity + allocatedCapacity;

        if (newTotalCapacity > 1.5) {
            validationMessageEl.textContent = `Error: Total capacity would be ${newTotalCapacity.toFixed(2)}. Maximum allowed is 1.5.`;
            validationMessageEl.classList.remove('warning');
            validationMessageEl.classList.add('error');
        } else if (newTotalCapacity > 1.0) {
            validationMessageEl.textContent = `Warning: Employee is over-capacity (Total: ${newTotalCapacity.toFixed(2)}).`;
            validationMessageEl.classList.remove('error');
            validationMessageEl.classList.add('warning');
        } else {
            validationMessageEl.textContent = `Total expected capacity: ${newTotalCapacity.toFixed(2)}`;
            validationMessageEl.classList.remove('error', 'warning');
        }

        const effectiveCapacity = allocatedCapacity * projectFit;
        const selectedProjectId = Number(selectElement.value);

        let currentProjectAssigned = 0;
        let projectTotalRequired = 0;

        if (selectedProjectId) {
            const selectedProject = currentProjects.find(p => p.id === selectedProjectId);
            projectTotalRequired = selectedProject ? selectedProject.EmployeeCapacity : 0;

            currentProjectAssigned = allEmployees.reduce((totalSum, emp) => {
                if (!emp.assignments) return totalSum;
                const assignment = emp.assignments.find(a => Number(a.projectId) === selectedProjectId);
                if (assignment) {
                    const cap = assignment.AssignedCapacity !== undefined ? assignment.AssignedCapacity : assignment.assignedCapacity;
                    const fit = assignment.ProjectFit !== undefined ? assignment.ProjectFit : assignment.projectFit;
                    return totalSum + (Number(cap) * Number(fit));
                }
                return totalSum;
            }, 0);
        }

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
    capacityInput.oninput = updateCalculations;
    fitInput.oninput = updateCalculations;
    selectElement.onchange = updateCalculations;
    updateCalculations();
}


function openEditAssignmentPopup(employeeId, projectId, source) {
    const eId = Number(employeeId);
    const employee = currentData.employees.find(e => e.id === eId);
    if (!employee) return;

    const currentAssignment = employee.assignments.find(a => Number(a.projectId) === Number(projectId));

    const fitInput = document.getElementById('projectfit-range');
    const capacityInput = document.getElementById('capacity-range');
    fitInput.value = currentAssignment.ProjectFit !== undefined ? currentAssignment.ProjectFit : currentAssignment.projectFit;
    capacityInput.value = currentAssignment.AssignedCapacity !== undefined ? currentAssignment.AssignedCapacity : currentAssignment.assignedCapacity;

    document.getElementById('fit-value-display').textContent = Number(fitInput.value).toFixed(1);
    document.getElementById('capacity-value-display').textContent = Number(capacityInput.value).toFixed(1);

    const saveBtn = document.querySelector('.save-assignment');
    saveBtn.setAttribute('data-employee-id', employeeId);
    saveBtn.setAttribute('data-project-id', projectId);
    saveBtn.setAttribute('data-context', source || '');
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
});

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
            return `
                            <tr>
                                <td>${proj.projectname}</td>
                                <td>${job ? job.AssignedCapacity : '0'}</td>
                                <td>${job ? job.ProjectFit : '0'}</td>
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
    const employee = currentData.employees.find(e => e.id === Number(employeeId));

    if (!employee || !employee.assignments) return 0;

    const job = employee.assignments.find(a => Number(a.projectId) === Number(projectId));
    return job ? job.AssignedCapacity : 0;
}

function countProjectFit(year, month, employeeId, projectId) {
    const employee = currentData.employees.find(e => e.id === Number(employeeId));

    if (!employee || !employee.assignments) return 0;

    const job = employee.assignments.find(a => Number(a.projectId) === Number(projectId));
    return job ? job.ProjectFit : 0;
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
        if (!emp.assignments || !emp.assignments.some(a => a.projectId === Number(projectId))) return sum;
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

console.log(getEmployeeProfit(state.selectedYear, state.selectedMonth, 1, 101, [
    "2025-03-11",
    "2025-03-12",
    "2025-03-13",
    "2025-03-18"
]));


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

const addEmplForm = document.querySelector('.add-new-employee-container .contact-form-in');
addEmplForm.addEventListener('submit', (e) => {
    e.preventDefault();
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
        const cap = assignment.AssignedCapacity !== undefined ? assignment.AssignedCapacity : assignment.assignedCapacity;
        return sum + (cap ? Number(cap) : 0);
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
})

const addPorjForm = document.querySelector('.add-new-project-container .contact-form-in');
addPorjForm.addEventListener('submit', (e) => {
    e.preventDefault();
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











document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('catalogDt')) {
        localStorage.setItem('catalogDt', JSON.stringify(catalogDt));
    }
    updateDashboard();
});