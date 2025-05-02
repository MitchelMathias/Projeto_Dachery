document.getElementById("formulario").addEventListener("submit", function(nao_recarregarPagina){
    nao_recarregarPagina.preventDefault();

    const nome = document.getElementById("nome").value
    const email = document.getElementById("email").value
    const telefone = document.getElementById("telefone").value
    const mensagem = document.getElementById("mensagem").value

    const dados = `Nome: ${nome} \n
                    Email: ${email} \n
                    Telefone: ${telefone} \n
                    Mensagem: ${mensagem}`

    fetch("https://dachery.vercel.app/",{
        method:"POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({dados})
    }).then(function(){
        window.location.href = "https://dachery.vercel.app/"
        alert("Mensagem enviada com sucesso!")
    })
})
