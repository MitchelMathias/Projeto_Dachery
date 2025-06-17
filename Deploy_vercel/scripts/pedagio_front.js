async function fetchDado() {
        try {
            const res = await fetch('/api/pedagio');
            const texto = await res.text();
            document.getElementById('resultado').innerText = texto;
        } catch {
            document.getElementById('resultado').innerText = 'Erro ao buscar';
        }
    }
    fetchDado();
    setInterval(fetchDado, 5000);