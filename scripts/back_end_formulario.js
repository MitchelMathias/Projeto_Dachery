document.getElementById("formulario").addEventListener("submit", function(nao_recarregarPagina){
    nao_recarregarPagina.preventDefault();

    const nome = document.getElementById("nome").value
    const email = document.getElementById("email").value
    const telefone = document.getElementById("telefone").value
    const mensagem = document.getElementById("mensagem").value

    Email.send({
        secureToken:"xpfj rspo gjaj ryci",
        to: "mitchel.mathias.dev@gmail.com",
        from: email,
        subject: "Mensagem do Forumulário",
        body: "Nome: " + nome + "\n"
            + "Email: " + email + "\n"
            + "Telefone: " + telefone + "\n"
            + "Mensagem: " + mensagem
    }).then(function(recarrgando_site){
        window.location.href = "../index.html"
        alert("Mensagem enviada com sucesso!")
    })
})