document.addEventListener('DOMContentLoaded', () => {
    const clientsList = document.getElementById('clients-list');
    const clientModal = document.getElementById('client-modal');
    const closeModal = document.querySelector('.close');
    const deleteClientButton = document.getElementById('delete-client');
    const btnClients = document.getElementById('clients');
    const btnRegisterClient = document.getElementById('register-client');
    const btnAgenda = document.getElementById('agenda');

    function loadClients() {
        const clients = JSON.parse(localStorage.getItem('clients')) || [];
        clientsList.innerHTML = '';
        clients.forEach((client) => {
            const clientCard = document.createElement('div');
            clientCard.className = 'client-card';
            clientCard.innerHTML = `
                <h3>${client.name}</h3>
                <p>Placa: ${client.carPlate}</p>
            `;
            clientCard.addEventListener('click', () => {
                showClientDetails(client);
            });
            clientsList.appendChild(clientCard);
        });
    }

    function showClientDetails(client) {
        document.getElementById('client-name').textContent = client.name;
        document.getElementById('client-cpf').textContent = client.cpf;
        document.getElementById('client-phone').textContent = client.phone;
        document.getElementById('client-email').textContent = client.email;
        document.getElementById('client-cep').textContent = client.cep;
        document.getElementById('client-city').textContent = client.city;
        document.getElementById('client-state').textContent = client.state;
        document.getElementById('client-address').textContent = client.address;
        document.getElementById('client-houseNumber').textContent = client.houseNumber;
        document.getElementById('client-complement').textContent = client.complement;
        document.getElementById('client-carPlate').textContent = client.carPlate;

        clientModal.style.display = 'block';
    }

    function hideClientDetails() {
        clientModal.style.display = 'none';
    }

    function navigateTo(url) {
        hideClientDetails();
        // Pequeno atraso para garantir que o modal seja ocultado antes de navegar
        setTimeout(() => {
            window.location.href = url;
        }, 300);
    }

    btnClients.addEventListener('click', () => {
        navigateTo('clientes.html');
    });

    btnRegisterClient.addEventListener('click', () => {
        navigateTo('clientescadastrados.html');
    });

    btnAgenda.addEventListener('click', () => {
        hideClientDetails(); // Oculta o modal de detalhes dos clientes
        navigateTo('agenda.html');
    });

    closeModal.addEventListener('click', () => {
        hideClientDetails();
    });

    deleteClientButton.addEventListener('click', () => {
        if (confirm('Tem certeza de que deseja apagar este cliente?')) {
            let clients = JSON.parse(localStorage.getItem('clients')) || [];
            const clientName = document.getElementById('client-name').textContent;
            clients = clients.filter(client => client.name !== clientName);
            localStorage.setItem('clients', JSON.stringify(clients));
            hideClientDetails();
            loadClients();
        }
    });

    loadClients();
});
