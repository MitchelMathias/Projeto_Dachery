async function fetchDado() {
    try {
        const res = await fetch('/api/pedagio');
        const data = await res.json();
        document.getElementById('resultado').innerText = data.resultado || 'Sem resultado';
    } catch (err) {
        // erro grave como sem conexão, JSON inválido, etc.
        document.getElementById('resultado').innerText = 'Erro ao buscar dados: ' + err.message;
    }
}

fetchDado();
setInterval(fetchDado, 5000);