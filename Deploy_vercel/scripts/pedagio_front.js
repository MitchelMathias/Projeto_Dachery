async function fetchDado() {
    try {
        const res = await fetch('/api/pedagio');
        if (!res.ok) {
            // resposta HTTP ruim, lê texto ou json do erro
            const textoErro = await res.text();
            document.getElementById('resultado').innerText = `Erro HTTP: ${res.status} - ${textoErro}`;
            return;
        }
        const data = await res.json();
        document.getElementById('resultado').innerText = data.resultado;
    } catch (err) {
        // erro de rede ou outro
        document.getElementById('resultado').innerText = 'Erro ao buscar dados: ' + err.message;
    }
}
