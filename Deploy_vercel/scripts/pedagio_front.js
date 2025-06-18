async function fetchDado() {
    try {
        const res = await fetch('/api/pedagio');
        const texto = await res.text();
        document.getElementById('resultado').innerText = texto;
    } catch (e) {
        document.getElementById('resultado').innerText = 'Erro ao buscar';
        console.error(e);
    }
}
fetchDado();
setInterval(fetchDado, 50000);
