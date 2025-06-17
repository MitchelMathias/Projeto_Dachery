async function fetchDado() {
    try {
        const res = await fetch('/api/pedagio');
        const contentType = res.headers.get('content-type');

        if (contentType && contentType.includes('application/json')) {
            const data = await res.json();
            document.getElementById('resultado').innerText = data.resultado || 'Sem resultado';
        } else {
            const text = await res.text();
            document.getElementById('resultado').innerText = 'Erro (texto): ' + text;
        }
    } catch (err) {
        document.getElementById('resultado').innerText = 'Erro ao buscar dados: ' + err.message;
    }
}

fetchDado();
setInterval(fetchDado, 5000);