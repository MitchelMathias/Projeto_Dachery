async function cadastrando(){
    const response = await fetch('http://localhost:3001/cadastrando',{
        method:"POST",
        headers: {"content-type": "application/json"},
        body: JSON.stringify({
            nome: document.getElementById('nome').value,
            ultima_ferias: document.getElementById('ultima_ferias').value,
            aniversario: document.getElementById('aniversario').value,
            ultima_ata: document.getElementById('ultima_ata').value
        })
    })
    const resposta = await response.json()
    alert('Usuario Cadastrado com sucesso')
}

async function consulta(){
    const response = await fetch('http://localhost:3001/consultando',{
        method: "POST",
        headers:{"content-type":"application/json"},
        body: JSON.stringify({
            nome: document.getElementById('nome_del').value
        })
    })
    const recebe_busca = await response.json();
    if (recebe_busca.length > 0) {
        let html = `
        <style>
            table {
                margin-top: 10px;
                width: 100%;
                border-collapse: collapse;
                }
                th, td {
                    border: 1px solid #ccc;
                    padding: 8px;
                    text-align: left;
                    }
                    th {
                        background-color: #f2f2f2;
                        }
                        </style>
                        <table>
                        <tr>
                        <th>ID</th><th>Nome</th><th>Férias</th><th>Aniversário</th><th>Ata</th>
                        </tr>
                    `;
                    recebe_busca.forEach(f => {
                        let ferias = f.ultima_ferias.slice(0,10).split('-').reverse().join('/');
                        let aniversario = f.aniversario.slice(0,10).split('-').reverse().join('/');
                        let ata = f.ata_medica.slice(0,10).split('-').reverse().join('/');
                        html += `<tr><td><input type="checkbox" value="${f.id}"></td><td>${f.nome}</td><td>${ferias}</td><td>${aniversario}</td><td>${ata}</td></tr>`;
                    });
                    html += '</table>';
                    document.getElementById('recebe_busca').innerHTML = html;
                    
                } else {
                    document.getElementById('recebe_busca').innerText = 'Nenhum resultado encontrado.';
                }
}

async function consultaDel() {
    const response = await fetch('http://localhost:3001/consultando', {
        method: "POST",
        headers: {"content-type":"application/json"},
        body: JSON.stringify({
            nome: document.getElementById('nome_del_del').value
        })
    });
    const recebe_busca = await response.json();
    if (recebe_busca.length > 0) {
        let html = `
        <style>
            table { margin-top: 10px; width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
        </style>
        <table>
            <tr><th>ID</th><th>Nome</th><th>Férias</th><th>Aniversário</th><th>Ata</th></tr>
        `;
        recebe_busca.forEach(f => {
            let ferias = f.ultima_ferias.slice(0,10).split('-').reverse().join('/');
            let aniversario = f.aniversario.slice(0,10).split('-').reverse().join('/');
            let ata = f.ata_medica.slice(0,10).split('-').reverse().join('/');
            html += `<tr><td><input type="checkbox" value="${f.id}"></td><td>${f.nome}</td><td>${ferias}</td><td>${aniversario}</td><td>${ata}</td></tr>`;
        });
        html += '</table>';
        document.getElementById('recebe_busca_del').innerHTML = html;
    } else {
        document.getElementById('recebe_busca_del').innerText = 'Nenhum resultado encontrado.';
    }
}

async function deletando(){

    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    const ids = [];
    
    for (let i = 0; i < checkboxes.length; i++) {
        ids.push(checkboxes[i].value);
    }
    
    const response = await fetch('http://localhost:3001/deletando',{
        method: "POST",
        headers:{"content-type":"application/json"},
        body: JSON.stringify({ids})
    })
    
    const retorno = await response.json()
    if(retorno == 'ok'){
        alert('Excluido com Sucesso')
        await consulta()
    }
}

document.getElementById('cadastrando').addEventListener('submit',async (e)=>{
    e.preventDefault()
    await cadastrando()
    document.getElementById('nome').value = ''
    document.getElementById('ultima_ferias').value = ''
    document.getElementById('aniversario').value = ''
    document.getElementById('ultima_ata').value = ''
})

document.getElementById('consultando').addEventListener('submit', async (e)=>{
    e.preventDefault()
    await consulta()
})
document.getElementById('consultando_del').addEventListener('submit', async (e)=>{
    e.preventDefault()
    await consultaDel()
})

document.getElementById('deletando').onclick = async () =>{
    await deletando()
}

document.getElementById('editando').onclick = async () => {
    const checkbox = document.querySelector('input[type="checkbox"]:checked').value;
    const response = await fetch('http://localhost:3001/consultando', {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
            nome: document.getElementById('nome_del').value
        })
    });
    const recebe_busca = await response.json();

    if (recebe_busca.length > 0) {
        recebe_busca.forEach(f => {
            let nome = f.nome;
            let ferias = f.ultima_ferias.slice(0, 10);     // já vem como "2024-04-29"
            let aniversario = f.aniversario.slice(0, 10);  // idem
            let ata = f.ata_medica.slice(0, 10);           // idem

            document.getElementById('nome').value = nome;
            document.getElementById('ultima_ferias').value = ferias;
            document.getElementById('aniversario').value = aniversario;
            document.getElementById('ultima_ata').value = ata;
        });
    }
    await deletando()
}
