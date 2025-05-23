const estiloTabela = `
<style>
    table {
        margin-top: 10px;
        width: 100%;
        border-collapse: collapse;
    }
    th, td {
        border: 3px solid #000;
        padding: 8px;
        text-align: left;
    }
    th {
        
        background-color: #044993;
        color: #FFFFFF;
    }
    td {
        margin:0;
        padding:6px;
        color: #000;
    }
</style>
`;

// ✅ Função genérica para gerar qualquer tabela
function gerarTabela(dados, colunas) {
    let tabela = `
    <table>
        <tr>
            ${colunas.map(col => `<th>${col.titulo}</th>`).join('')}
        </tr>
    `;

    tabela += dados.map(item => `
        <tr>
            ${colunas.map(col => `<td>${item[col.campo]}</td>`).join('')}
        </tr>
    `).join('');

    tabela += '</table>';

    return tabela;
}

// 🔥 Função para carregar e preencher qualquer tipo de dado
function carregarTabela(url, colunas, elementosDestino) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const tabelaAtual = estiloTabela + gerarTabela(data.mesAtual, colunas);
            document.getElementById(elementosDestino.atual).innerHTML = tabelaAtual;

            const tabelaProximo = gerarTabela(data.mesProximo, colunas);
            document.getElementById(elementosDestino.proximo).innerHTML = tabelaProximo;

            const tabelaPosterior = gerarTabela(data.mesPosterior, colunas);
            document.getElementById(elementosDestino.posterior).innerHTML = tabelaPosterior;
        })
        .catch(error => console.error(`Erro ao carregar dados de ${url}:`, error));
}

// 🚀 Executa quando carregar a página
document.addEventListener('DOMContentLoaded', () => {
    // 🎂 Aniversariantes
    carregarTabela(
        '/aniversariantes',
        [
            { titulo: 'Nome', campo: 'nome' },
            { titulo: 'Aniversário', campo: 'aniversario' }
        ],
        {
            atual: 'mesAtual',
            proximo: 'mesProximo',
            posterior: 'mesPosterior'
        }
    );

    // 🩺 Ata Médica
    carregarTabela(
        '/ataMedica',
        [
            { titulo: 'Nome', campo: 'nome' },
            { titulo: 'Vencimento', campo: 'vencimento' }
        ],
        {
            atual: 'vencida',
            proximo: 'vencemProximoMes',
            posterior: 'vigentes'
        }
    );

    // 🏖️ Férias
    carregarTabela(
        '/ferias',
        [
            { titulo: 'Nome', campo: 'nome' },
            { titulo: 'Apto em', campo: 'vencimento' }
        ],
        {
            atual: 'feriasAtual',
            proximo: 'feriasProximo',
            posterior: 'feriasPosterior'
        }
    );
});
