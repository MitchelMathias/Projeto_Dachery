fetch("/api/email", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
        nome: document.getElementById("nome").value,
        email: document.getElementById("email").value,
        telefone: document.getElementById("tel").value,
        mensagem: document.getElementById("mensagem").value
    })
})
.then(() => {
    alert("Mensagem enviada!");
    window.location.href = "/";
})
.catch(() => alert("Erro ao enviar!"));
