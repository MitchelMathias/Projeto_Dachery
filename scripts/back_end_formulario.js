document.getElementById("formulario").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    try {
        const response = await fetch("/api/email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                nome: document.getElementById("nome").value,
                email: document.getElementById("email").value,
                telefone: document.getElementById("tel").value,
                mensagem: document.getElementById("mensagem").value
            })
        });

        const textResponse = await response.text();
        
        try {
            const data = JSON.parse(textResponse);
            alert(data.message);
        } catch {
            alert(`Resposta inválida:\n${textResponse.slice(0, 100)}...`);
        }
        
    } catch (error) {
        alert(`Erro na requisição: ${error.message}`);
    }
});