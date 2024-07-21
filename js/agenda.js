

document.addEventListener('DOMContentLoaded', () => {
    const calendarDays = document.getElementById('calendar-days');
    const monthYear = document.getElementById('month-year');
    const prevMonthButton = document.getElementById('prev-month');
    const nextMonthButton = document.getElementById('next-month');
    const modal = document.getElementById('schedule-modal');
    const closeButton = document.querySelector('.close-button');
    const scheduleForm = document.getElementById('schedule-form');
    const scheduledList = document.getElementById('scheduled-list');

        document.getElementById('agenda').addEventListener('click', () => {
            window.location.href = 'agenda.html';
        });
    
        document.getElementById('clients').addEventListener('click', () => {
            window.location.href = 'clientes.html';
        });
    
        document.getElementById('register-client').addEventListener('click', () => {
            window.location.href = 'clientescadastrados.html';
        });

    let currentDate = new Date();
    let currentDay = null;

    const getStoredEvents = () => JSON.parse(localStorage.getItem('events')) || {};
    const saveEvent = (date, event) => {
        const events = getStoredEvents();
        if (!events[date]) {
            events[date] = [];
        }
        events[date].push(event);
        events[date].sort((a, b) => a.time.localeCompare(b.time)); // Ordena os eventos por hora
        localStorage.setItem('events', JSON.stringify(events));
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
            li.addEventListener('click', () => openModal(date));

            const events = getStoredEvents();
            if (events[date] && events[date].length > 0) {
                li.classList.add('scheduled');
            }

            calendarDays.appendChild(li);
        }
    };

    const openModal = (date) => {
        currentDay = date;
        modal.style.display = 'block';
        updateScheduledList();
    };

    const closeModal = () => {
        modal.style.display = 'none';
        currentDay = null;
    };

    const updateScheduledList = () => {
        scheduledList.innerHTML = '';
        const events = getStoredEvents()[currentDay] || [];
        events.forEach((event, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>
                    <span class="label">Nome:</span> ${event.name}<br>
                    <span class="label">Hora:</span> ${event.time}<br>
                    <span class="label">Motivo:</span> ${event.reason}
                </span>
                <button onclick="deleteScheduledEvent(${index})">Apagar</button>
            `;
            scheduledList.appendChild(li);
        });
    };

    window.deleteScheduledEvent = (index) => {
        deleteEvent(currentDay, index);
        updateScheduledList();
    };

    scheduleForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(scheduleForm);
        const event = {
            name: formData.get('name'),
            time: formData.get('time'),
            reason: formData.get('reason')
        };
        saveEvent(currentDay, event);
        updateScheduledList();
        scheduleForm.reset();
    });

    closeButton.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            closeModal();
        }
    });

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
