document.getElementById("formulario").addEventListener("submit", function(e){
    e.preventDefault();

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
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        document.getElementById("formulario").reset();
    })
    .catch(error => {
        alert("Erro: " + error.message);
    });
});