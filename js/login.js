document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const createAccountButton = document.getElementById('create-account');
    const backToLoginButton = document.getElementById('back-to-login');
    const loginContainer = document.getElementById('login-container');
    const registerContainer = document.getElementById('register-container');
    const errorMessage = document.getElementById('error-message');
    const registerErrorMessage = document.getElementById('register-error-message');

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        getUser(username, (user) => {
            if (user && user.password === password) {
                window.location.href = 'profile.html';
            } else {
                errorMessage.textContent = 'Credenciais inválidas.';
                errorMessage.style.display = 'block';
            }
        });
    });

    createAccountButton.addEventListener('click', () => {
        loginContainer.classList.add('hidden');
        registerContainer.classList.remove('hidden');
    });

    backToLoginButton.addEventListener('click', () => {
        registerContainer.classList.add('hidden');
        loginContainer.classList.remove('hidden');
    });

    registerForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const newUsername = document.getElementById('new-username').value;
        const newPassword = document.getElementById('new-password').value;

        getUser(newUsername, (user) => {
            if (user) {
                registerErrorMessage.textContent = 'Usuário já existe.';
                registerErrorMessage.style.display = 'block';
            } else {
                addUser(newUsername, newPassword);
                registerContainer.classList.add('hidden');
                loginContainer.classList.remove('hidden');
            }
        });
    });
});

// Cria e abre o banco de dados IndexedDB
const dbName = 'mecanicaConnectDB';
const dbVersion = 1;
let db;

const openDB = () => {
    const request = indexedDB.open(dbName, dbVersion);

    request.onupgradeneeded = (event) => {
        db = event.target.result;
        const objectStore = db.createObjectStore('users', { keyPath: 'username' });
        objectStore.createIndex('password', 'password', { unique: false });
    };

    request.onsuccess = (event) => {
        db = event.target.result;
    };

    request.onerror = (event) => {
        console.error('Error opening database:', event.target.errorCode);
    };
};

const addUser = (username, password) => {
    const transaction = db.transaction(['users'], 'readwrite');
    const objectStore = transaction.objectStore('users');
    const request = objectStore.add({ username, password });

    request.onsuccess = () => {
        console.log('User added to the database.');
    };

    request.onerror = (event) => {
        console.error('Error adding user:', event.target.errorCode);
    };
};

const getUser = (username, callback) => {
    const transaction = db.transaction(['users'], 'readonly');
    const objectStore = transaction.objectStore('users');
    const request = objectStore.get(username);

    request.onsuccess = (event) => {
        callback(event.target.result);
    };

    request.onerror = (event) => {
        console.error('Error retrieving user:', event.target.errorCode);
    };
};

// Inicializa o banco de dados
openDB();
