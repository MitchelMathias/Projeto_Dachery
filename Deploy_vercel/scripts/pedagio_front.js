async function fetchDado() {
    try {
        const res = await fetch('/api/dado'); // Caminho relativo correto
        const texto = await res.text(); // Só lê uma vez
        document.getElementById('resultado').innerText = texto;
    } catch (e) {
        document.getElementById('resultado').innerText = 'Erro ao buscar';
        console.error(e);
    }
}
fetchDado();
setInterval(fetchDado, 50000);
