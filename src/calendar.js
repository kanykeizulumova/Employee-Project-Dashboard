const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function createCalendar(year, month, vacationDates, fullName) {
    const calendarHeader = document.getElementById('calendar-header');
    const calendarGrid = document.getElementById('calendar-grid');
    const calendarInfo = document.getElementById('calendar-info');

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



export { createCalendar, countVacationWorkingDays, getVacationCoefficient };