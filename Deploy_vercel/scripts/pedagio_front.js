async function fetchDado() {
    try {
        const res = await fetch('/api/pedagio');
        
        // Verificar se a resposta é JSON
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const text = await res.text();
            throw new Error(`Resposta inesperada: ${text.slice(0, 100)}...`);
        }

        const data = await res.json();
        document.getElementById('resultado').innerHTML = data.resultado || data.error || 'Sem resultado';
    } catch (err) {
        document.getElementById('resultado').innerHTML = 'Erro: ' + err.message;
        console.error('Detalhes do erro:', err);
    }
}