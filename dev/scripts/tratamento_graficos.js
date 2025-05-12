const data = new Date();
const dia = data.getDate();
const mes = data.getMonth() + 1;
const ano = data.getFullYear();

function aniversariantes() {
    const fs = require('fs');
    const caminho = "../Banco_Dados_Teste/aniversario.txt";

    fs.readFile(caminho, 'utf8', (erro, dados) => {
        if (erro) {
            console.error("Erro ao ler o arquivo:", erro);
            return;
        }

        const aniversariantes_atual = [];
        const aniversariantes_proximo = [];
        const aniversariantes_posterior = [];

        const linhas = dados.split("\n");

        for (let linha of linhas) {
            const partes = linha.split("-");
            if (partes.length < 3) continue;

            const nome = partes[1];
            const [dia_aniv, mes_aniv] = partes[2].split("/").map(Number);

            if (mes_aniv === mes) {
                aniversariantes_atual.push(`${nome} no dia ${dia_aniv}`);
            } else if (mes_aniv === (mes % 12) + 1) {
                aniversariantes_proximo.push(`${nome} no dia ${dia_aniv}`);
            } else if (mes_aniv === (mes % 12) + 2) {
                aniversariantes_posterior.push(`${nome} no dia ${dia_aniv}`);
            }
        }
    });
}

function ata_medica(){
    const fs = require('fs')
    const caminho = "../Banco_Dados_Teste/ata_medica.txt"
    const vencidos = []
    const nesse_mes = []
    const proximo = []

    fs.readFile(caminho, 'utf8',(erro, dados) =>{
        if(!erro){
            const conteudo = dados.split("\n")
            for (let item of conteudo){
                const nome = item.split("-")[1]
                const data_ata = item.split("-")[2]
                let mes_ata = parseInt(data_ata.split("/")[1])
                let ano_ata = parseInt(data_ata.split("/")[2])
                mes_ata += 6
                if (mes_ata > 12){
                    mes_ata -= 12
                    ano_ata +=1
                }
                if (ano_ata < ano || (ano_ata === ano && mes_ata < mes)) {
                    vencidos.push(`${nome} no dia ${data_ata}`)
                } else if (ano_ata === ano && mes_ata === mes) {
                    nesse_mes.push(`${nome} no dia ${data_ata}`)
                } else if (ano_ata === ano && mes_ata === mes + 1) {
                    proximo.push(`${nome} no dia ${data_ata}`)
                }
            }
        console.log("Vencidos: ", vencidos)
        console.log("Este Mes: ", nesse_mes)
        console.log("Próximo: ", proximo)
        }
        if (erro){
            console.error("Erro ao ler o arquivo:", erro)
        }
    })
}

function ferias(){
    const fs = require('fs')
    const caminho = "../Banco_Dados_Teste/ferias.txt"
    let ferias_atrasadas = []
    let ferias_este_mes = []
    let ferias_proximo_mes = []
    let em_dia = []


    fs.readFile(caminho, 'utf8', (erro, dados) =>{
        if (!erro){
            const conteudo = dados.split("\n")
            for (let item of conteudo){
                const nome = item.split("-")[1]
                const data_ferias = item.split("-")[2]
                const dia_ferias = parseInt(data_ferias.split("/")[0])
                let mes_ferias = parseInt(data_ferias.split("/")[1])
                let ano_ferias = parseInt(data_ferias.split("/")[2])
                ano_ferias += 1

                if (ano_ferias === ano && mes_ferias === mes) {
                    ferias_este_mes.push(`${nome} no dia ${data_ferias}`)
                }
                else if (ano_ferias === ano && mes_ferias === mes + 1) {
                    ferias_proximo_mes.push(`${nome} no dia ${data_ferias}`)
                }
                else if (ano_ferias < ano || (ano_ferias === ano && mes_ferias < mes)) {
                    ferias_atrasadas.push(`${nome} no dia ${data_ferias}`)
                }
                else {
                    em_dia.push(`${nome} no dia ${data_ferias}`)
                }
            }
            console.log("Ferias atrasadas: ", ferias_atrasadas)
            console.log("Ferias este mes: ", ferias_este_mes)
            console.log("Ferias proximo mes: ", ferias_proximo_mes)
            console.log("Ferias em dia: ", em_dia)
        }
        if (erro){
            console.error("Erro ao ler o arquivo:", erro)
        }
    })
}