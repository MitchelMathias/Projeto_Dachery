document.getElementById("formulario").addEventListener("submit", function(e){
    e.preventDefault();

    fetch("https://dachery.vercel.app/", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            nome: document.getElementById("nome").value,
            email: document.getElementById("email").value,
            telefone: document.getElementById("tel").value,
            mensagem: document.getElementById("mensagem").value
        })
    })
    .then(response => response.json())  // Esperando o JSON de resposta
    .then(data => {
        if (data.success) {
            alert("Mensagem enviada!");
            window.location.href = "https://dachery.vercel.app/";
        } else {
            alert("Falha ao enviar: " + data.message);
        }
    })
    .catch((error) => alert("Erro ao enviar! " + error.message));
});
