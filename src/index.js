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
    const totalIncome = document.getElementById('total-income');
    totalIncome.innerHTML = `Total Estimated Income: ${data.reduce((sum, proj) => sum + (proj.budjet || 0), 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`;

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
                        <td>$ ${Number(proj.budjet).toFixed(2)}</td>
                        <td>${proj.EmployeeCapacity}</td>
                        <td>
                        <button class="show-btn btn" data-id="${proj.assignedEmployees}">Show Assigned Employees</button>
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

const projectsContainer = document.getElementById('projects-table-container');

projectsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('show-btn')) {
        const projectId = e.target.getAttribute('data-project-id');
        showProjectStaff(projectId);
    }
});

function showProjectStaff(projectId) {
    const currentData = catalogDt.monthlyData[getPeriodKey()];
    const assignedStaff = currentData.employees.filter(emp =>
        emp.assignments.id == projectId || (emp.assignments && emp.assignments.includes(Number(projectId)))
    );

    renderEmployeesAssignments(assignedStaff);
}

function renderEmployeesAssignments(data) {
    const popupDetails = document.getElementById('popup-details')
    popupDetails.style.display = '';
    const header = document.getElementById('popup-header');
    header.innerHTML = `<h3>Employees on E-Commerce Platform</h3> <button class="close-popup-btn btn">×</button>`
    const container = document.getElementById('popup-content');

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
                ${data.map(emp => `
                    <tr>
                        <td>${emp.name}  ${emp.surname}</td>
                        <td>${emp.assignments.AssignedCapacity}</td>
                        <td>${emp.assignments.ProjectFit}</td>
                        <td> <button class="edit-btn btn" data-id="${emp.assignments}">Edit assignments</button >
                        <button class="unassign-btn btn" data-id="${emp.assignments}">Unassign</button >
                        </td >
                    </tr >
        `).join('')
        }
            </tbody >
        </table >
    `;

    container.innerHTML = tableHtml;
}
