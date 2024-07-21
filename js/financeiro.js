document.addEventListener('DOMContentLoaded', () => {
    const calendarDays = document.getElementById('calendar-days');
    const monthYear = document.getElementById('month-year');
    const prevMonthButton = document.getElementById('prev-month');
    const nextMonthButton = document.getElementById('next-month');
    const scheduleModal = document.getElementById('schedule-modal');
    const financialModal = document.getElementById('financial-modal');
    const closeButtons = document.querySelectorAll('.close-button');
    const scheduleForm = document.getElementById('schedule-form');
    const financialForm = document.getElementById('financial-form');
    const scheduledList = document.getElementById('scheduled-list');
    const financialList = document.getElementById('financial-list');

    document.getElementById('agenda').addEventListener('click', () => {
        window.location.href = 'agenda.html';
    });

    document.getElementById('clients').addEventListener('click', () => {
        window.location.href = 'clientes.html';
    });

    document.getElementById('register-client').addEventListener('click', () => {
        window.location.href = 'clientescadastrados.html';
    });

    document.getElementById('financial').addEventListener('click', () => {
        financialModal.style.display = 'block';
        updateFinancialList();
    });

    let currentDate = new Date();
    let currentDay = null;

    const getStoredEvents = () => JSON.parse(localStorage.getItem('events')) || {};
    const getStoredFinancial = () => JSON.parse(localStorage.getItem('financial')) || {};

    const saveEvent = (date, event) => {
        const events = getStoredEvents();
        if (!events[date]) {
            events[date] = [];
        }
        events[date].push(event);
        events[date].sort((a, b) => a.time.localeCompare(b.time));
        localStorage.setItem('events', JSON.stringify(events));
    };

    const saveFinancial = (date, entry) => {
        const financialEntries = getStoredFinancial();
        if (!financialEntries[date]) {
            financialEntries[date] = [];
        }
        financialEntries[date].push(entry);
        localStorage.setItem('financial', JSON.stringify(financialEntries));
    };

    const deleteEvent = (date, index) => {
        const events = getStoredEvents();
        if (events[date]) {
            events[date].splice(index, 1);
            if (events[date].length === 0) {
                delete events[date];
            }
            localStorage.setItem('events', JSON.stringify(events));
        }
    };

    const deleteFinancialEntry = (date, index) => {
        const financialEntries = getStoredFinancial();
        if (financialEntries[date]) {
            financialEntries[date].splice(index, 1);
            if (financialEntries[date].length === 0) {
                delete financialEntries[date];
            }
            localStorage.setItem('financial', JSON.stringify(financialEntries));
        }
    };

    const updateCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        monthYear.textContent = `${currentDate.toLocaleString('default', { month: 'long' })} ${year}`;

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        calendarDays.innerHTML = '';

        for (let i = 0; i < firstDay.getDay(); i++) {
            const li = document.createElement('li');
            calendarDays.appendChild(li);
        }

        for (let day = 1; day <= lastDay.getDate(); day++) {
            const li = document.createElement('li');
            const date = `${year}-${month + 1}-${day}`;
            li.innerHTML = `<time datetime="${date}">${day}</time>`;
            li.addEventListener('click', () => openScheduleModal(date));

            const events = getStoredEvents();
            const financialEntries = getStoredFinancial();

            if (events[date] || financialEntries[date]) {
                li.classList.add('has-event');
            }

            calendarDays.appendChild(li);
        }
    };

    const openScheduleModal = (date) => {
        currentDay = date;
        scheduleModal.style.display = 'block';
        updateScheduledList();
    };

    const openFinancialModal = (date) => {
        currentDay = date;
        financialModal.style.display = 'block';
        updateFinancialList();
    };

    const closeModal = (modal) => {
        modal.style.display = 'none';
        currentDay = null;
    };

    closeButtons.forEach(button => {
        button.addEventListener('click', () => closeModal(button.closest('.modal')));
    });

    scheduleForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const event = {
            name: scheduleForm.name.value,
            time: scheduleForm.time.value,
            reason: scheduleForm.reason.value
        };
        saveEvent(currentDay, event);
        scheduleForm.reset();
        updateScheduledList();
    });

    financialForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const entry = {
            amount: financialForm.amount.value,
            type: financialForm.type.value
        };
        saveFinancial(currentDay, entry);
        financialForm.reset();
        updateFinancialList();
    });

    const updateScheduledList = () => {
        const events = getStoredEvents()[currentDay] || [];
        scheduledList.innerHTML = '';
        events.forEach((event, index) => {
            const li = document.createElement('li');
            li.textContent = `${event.time} - ${event.name}: ${event.reason}`;
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Excluir';
            deleteButton.addEventListener('click', () => {
                deleteEvent(currentDay, index);
                updateScheduledList();
            });
            li.appendChild(deleteButton);
            scheduledList.appendChild(li);
        });
    };

    const updateFinancialList = () => {
        const financialEntries = getStoredFinancial()[currentDay] || [];
        financialList.innerHTML = '';
        financialEntries.forEach((entry, index) => {
            const li = document.createElement('li');
            li.textContent = `${entry.type === 'entrada' ? 'Entrada' : 'Saída'}: R$ ${entry.amount}`;
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Excluir';
            deleteButton.addEventListener('click', () => {
                deleteFinancialEntry(currentDay, index);
                updateFinancialList();
            });
            li.appendChild(deleteButton);
            financialList.appendChild(li);
        });
    };

    prevMonthButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        updateCalendar();
    });

    nextMonthButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        updateCalendar();
    });

    updateCalendar();
});
