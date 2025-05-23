document.getElementById("formulario").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    alert('Enviando email');
    const response = await fetch("/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            nome: document.getElementById("nome").value,
            email: document.getElementById("email").value,
            tel: document.getElementById("tel").value,
            mensagem: document.getElementById("mensagem").value
        })
    });
    const resposta_json = await response.json()
    alert(resposta_json.message);
});

document.getElementById('login_login').addEventListener('submit', async e => {
    e.preventDefault();
    try {
        const resp = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: document.getElementById('username').value,
            password: document.getElementById('password').value
        })
    });
    const data = await resp.json();
    if (data.status === 'ok'){
        alert('Login realizado com Sucesso')
        window.location = 'pag01.html'
    }
    else{
        alert('Usuario ou Senha incorretos')
    }
    } catch (err) {
        alert('Erro inesperado, tente novamente!!')
    }
});