document.getElementById('login').addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                usuario: document.getElementById('usuario').value,
                senha: document.getElementById('password').value
            })
        });

        const data = await response.text();
        
        if (response.ok) {
            window.location.href = 'paginas/pag01.html'; // Caminho relativo correto
        } else {
            alert(data || 'Erro no login');
        }
    } catch (err) {
        alert('Erro de conexão: ' + err.message);
    }
});