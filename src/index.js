import './style.css';
import catalogDt from './data.json';
console.log('Данные загружены через import:', catalogDt);


const openButton = document.getElementById('open-button');
const toggleButton = document.getElementById('toggle-button');
const sidePanel = document.getElementById('side-panel');

const projectsContainer = document.getElementById('projects-table-container');

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
    selectedMonth: '3', // April
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
    const container = document.getElementById('table-container');

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

    container.innerHTML = tableHtml;
}

function renderEmployeesTable(data) {
    const container = document.getElementById('table-container');

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
                        <td>${emp.age}</td>
                        <td>${emp.position}</td>
                        <td>$ ${emp.salary.toLocaleString()}</td>
                        
                        <td>${emp.projectId}</td>
                        <td> <button class="show-btn btn" data-id="${emp.assignments}">Show Assignments</button >
                        </td >

        <td>
            <button class="vacation-btn btn" data-id="${emp.vacation}">Availability</button>
            <button class="edit-btn btn" data-id="${emp.id}">Delete</button>
            <button class="assignment-btn btn" data-id="${emp.assignments}">Assign</button>
        </td>
                    </tr >
        `).join('')}
            </tbody>
        </table>
    `;

    container.innerHTML = tableHtml;
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

            const job = emp.assignments.find(a => Number(a.id) === Number(projectId)) || emp.assignments[0];

            return `
                            <tr>
                                <td>${emp.name} ${emp.surname}</td>
                                <td>${job ? job.AssignedCapacity : '0'}</td>
                                <td>${job ? job.ProjectFit : '0'}</td>
                                <td>
                                <button class="edit-btn btn" data-id="${emp.assignments}">Edit assignments</button >
                                    <button class="unassign-btn btn" data-emp-id="${emp.id}">Unassign</button>
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




document.addEventListener('DOMContentLoaded', () => {
    updateDashboard();
});