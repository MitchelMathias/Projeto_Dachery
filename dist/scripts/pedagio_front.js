async function fetchDado() {
    try {
        const res = await fetch('/dado');
        document.getElementById('resultado').innerText = await res.text();
        console.log(res.text())
    } catch {
        document.getElementById('resultado').innerText = 'Erro ao buscar';
    }
}
fetchDado();
setInterval(fetchDado, 50000);