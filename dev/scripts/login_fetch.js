document.getElementById("login").addEventListener("submit", async e => {
    e.preventDefault();
    try {
        const response = await fetch("http://localhost:3001/api/email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: document.getElementById("username").value,
                password: document.getElementById("password").value,
            })
        });
        const data = await response.json();
        alert('Resposta do servidor: ' + JSON.stringify(data));
        window.location.href = "../paginas/pag01.html";
    } catch (err) {
        console.error(err);
    }
});