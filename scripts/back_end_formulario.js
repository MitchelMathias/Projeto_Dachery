document.getElementById("formulario").addEventListener("submit", function(event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const telefone = document.getElementById("telefone").value;
    const mensagem = document.getElementById("mensagem").value;

    // Objeto formatado corretamente para o servidor
    const dados = {
        nome: nome,
        email: email,
        telefone: telefone,
        mensagem: mensagem
    };

    fetch("https://dachery.vercel.app/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro na requisição');
        }
        return response.json();
    })
    .then(data => {
        alert("Mensagem enviada com sucesso!");
        window.location.href = "https://dachery.vercel.app/";
    })
    .catch(error => {
        console.error('Erro:', error);
        alert("Ocorreu um erro ao enviar a mensagem. Tente novamente.");
    });
});