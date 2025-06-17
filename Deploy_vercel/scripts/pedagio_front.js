async function fetchDado() {
    try {
        const res = await fetch('/api/pedagio');
        const data = await res.json();
        document.getElementById('resultado').innerText = data.dado;
    } catch {
        document.getElementById('resultado').innerText = 'Erro ao buscar';
    }
}

fetchDado();
setInterval(fetchDado, 5000);
