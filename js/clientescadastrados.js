document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('agenda').addEventListener('click', () => {
        window.location.href = 'agenda.html';
    });

    document.getElementById('clients').addEventListener('click', () => {
        window.location.href = 'clientes.html';
    });

    document.getElementById('register-client').addEventListener('click', () => {
        window.location.href = 'clientescadastrados.html';
    });

    const form = document.getElementById('client-form');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const cpf = document.getElementById('cpf').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;
        const cep = document.getElementById('cep').value;
        const city = document.getElementById('city').value;
        const state = document.getElementById('state').value;
        const address = document.getElementById('address').value;
        const houseNumber = document.getElementById('houseNumber').value;
        const complement = document.getElementById('complement').value;
        const carPlate = document.getElementById('carPlate').value;

        const newClient = { name, cpf, phone, email, cep, city, state, address, houseNumber, complement, carPlate };

        let clients = JSON.parse(localStorage.getItem('clients')) || [];
        clients.push(newClient);
        localStorage.setItem('clients', JSON.stringify(clients));

        alert('Cliente cadastrado com sucesso!');
        form.reset();
    });

    document.getElementById('cep').addEventListener('input', async (e) => {
        const cep = e.target.value.replace(/\D/g, '');
        if (cep.length === 8) {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();
            if (!data.erro) {
                document.getElementById('city').value = data.localidade;
                document.getElementById('state').value = data.uf;
            }
        }
    });

    const tabs = document.querySelectorAll('.tab');
    const formSections = document.querySelectorAll('.form-section');
    const nextToLocalizacao = document.getElementById('next-to-localizacao');
    const nextToAutomovel = document.getElementById('next-to-automovel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            formSections.forEach(section => section.classList.remove('active'));

            tab.classList.add('active');
            document.getElementById(tab.dataset.tab).classList.add('active');
        });
    });

    nextToLocalizacao.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        formSections.forEach(section => section.classList.remove('active'));

        document.querySelector('.tab[data-tab="localizacao"]').classList.add('active');
        document.getElementById('localizacao').classList.add('active');
    });

    nextToAutomovel.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        formSections.forEach(section => section.classList.remove('active'));

        document.querySelector('.tab[data-tab="automovel"]').classList.add('active');
        document.getElementById('automovel').classList.add('active');
    });
});
