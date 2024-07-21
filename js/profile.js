document.addEventListener('DOMContentLoaded', () => {
    const username = 'User'; // Substituir pelo username real
    document.querySelector('#profile-container h2').textContent = `Welcome, ${username}`;

    document.getElementById('agenda').addEventListener('click', () => {
        window.location.href = 'agenda.html';
    });

    document.getElementById('clients').addEventListener('click', () => {
        window.location.href = 'clientes.html';
    });

    document.getElementById('register-client').addEventListener('click', () => {
        window.location.href = 'clientescadastrados.html';
    });
});
