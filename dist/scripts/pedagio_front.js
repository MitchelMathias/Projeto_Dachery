async function fetchDado() {
    try {
        const res = await fetch('http://localhost:3000/dado');
        document.getElementById('resultado').innerText = await res.text();
    } catch {
        document.getElementById('resultado').innerText = 'Erro ao buscar';
    }
}
fetchDado();
setInterval(fetchDado, 5000);