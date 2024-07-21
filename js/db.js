const dbName = 'mecanicaConnectDB';
const dbVersion = 1;
let db;

const openDB = () => {
    const request = indexedDB.open(dbName, dbVersion);

    request.onupgradeneeded = (event) => {
        db = event.target.result;
        const usersStore = db.createObjectStore('users', { keyPath: 'username' });
        usersStore.createIndex('password', 'password', { unique: false });

        const eventsStore = db.createObjectStore('events', { keyPath: 'id', autoIncrement: true });
        eventsStore.createIndex('date', 'date', { unique: false });
    };

    request.onsuccess = (event) => {
        db = event.target.result;
    };

    request.onerror = (event) => {
        console.error('Error opening database:', event.target.errorCode);
    };
};

const addEvent = (event) => {
    const transaction = db.transaction(['events'], 'readwrite');
    const store = transaction.objectStore('events');
    const request = store.add(event);

    request.onsuccess = () => {
        console.log('Event added to the database.');
    };

    request.onerror = (event) => {
        console.error('Error adding event:', event.target.errorCode);
    };
};

const getEventsByDate = (date, callback) => {
    const transaction = db.transaction(['events'], 'readonly');
    const store = transaction.objectStore('events');
    const index = store.index('date');
    const request = index.openCursor(IDBKeyRange.only(date));

    const events = [];
    request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
            events.push(cursor.value);
            cursor.continue();
        } else {
            callback(events);
        }
    };

    request.onerror = (event) => {
        console.error('Error retrieving events:', event.target.errorCode);
    };
};

const deleteEvent = (id) => {
    const transaction = db.transaction(['events'], 'readwrite');
    const store = transaction.objectStore('events');
    const request = store.delete(id);

    request.onsuccess = () => {
        console.log('Event deleted from the database.');
    };

    request.onerror = (event) => {
        console.error('Error deleting event:', event.target.errorCode);
    };
};

openDB();

export { addEvent, getEventsByDate, deleteEvent };
