document.addEventListener('DOMContentLoaded', () => {
    const loadingText = document.getElementById('loading-text');
    let dots = 0;

    const interval = setInterval(() => {
        if (dots < 3) {
            loadingText.textContent += '.';
            dots++;
        } else {
            loadingText.textContent = 'Iniciando';
            dots = 0;
        }
    }, 500);

    // Não é mais necessário redirecionar após um tempo fixo
    // O redirecionamento será feito pelo main.js após a verificação de atualizações
});
