document.getElementById("formulario").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const response = await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            nome: document.getElementById("nome").value,
            email: document.getElementById("email").value,
            tel: document.getElementById("suaEmpresa").value,
            mensagem: document.getElementById("mensagem").value
        })
    });
    
    const result = await response.json();
    alert(result.message);
});