const connection = require('./bancodados.js');

module.exports =  async (req, res) => {
    class Ferias {
        constructor() {
            const hoje = new Date();
            this.hoje = hoje;
            this.mes = hoje.getMonth(); // 0-11
            this.ano = hoje.getFullYear();
            this.feriasVencidas = [];
            this.feriasProximoMes = [];
            this.feriasMesPosterior = [];
        }

        formatarData(data) {
            return `${data.getDate().toString().padStart(2, '0')}/` +
                    `${(data.getMonth() + 1).toString().padStart(2, '0')}/` +
                    `${data.getFullYear()}`;
        }

        async carregarFerias() {
            return new Promise((resolve, reject) => {
                const query = 'SELECT * FROM funcionarios WHERE ultima_ferias IS NOT NULL';
                connection.query(query, (erro, resultado) => {
                    if (erro) return reject(erro);
                    resolve(resultado);
                });
            });
        }

        calcularVencimento(dataOriginal) {
            const venc = new Date(dataOriginal);
            venc.setFullYear(venc.getFullYear() + 1);
            return venc;
        }

        async classificarFerias() {
            const ferias = await this.carregarFerias();
            const hoje = this.hoje;

            ferias.forEach(func => {
                const dataOriginal = new Date(func.ultima_ferias);
                const vencimento = this.calcularVencimento(dataOriginal);

                const vencimentoMes = vencimento.getMonth();
                const vencimentoAno = vencimento.getFullYear();

                const vencInfo = {
                    id: func.id,
                    nome: func.nome,
                    vencimento: this.formatarData(vencimento)
                };

                if (vencimento <= hoje) {
                    this.feriasVencidas.push(vencInfo);
                } else if (
                    (vencimentoAno === this.ano && vencimentoMes === this.mes + 1) ||
                    (this.mes === 11 && vencimentoAno === this.ano + 1 && vencimentoMes === 0)
                ) {
                    this.feriasProximoMes.push(vencInfo);
                } else if (
                    (vencimentoAno === this.ano && vencimentoMes === this.mes + 2) ||
                    (this.mes === 10 && vencimentoAno === this.ano + 1 && vencimentoMes === 0) ||
                    (this.mes === 11 && vencimentoAno === this.ano + 1 && vencimentoMes === 1)
                ) {
                    this.feriasMesPosterior.push(vencInfo);
                }
            });
        }

        async buscarTodos() {
            await this.classificarFerias();
            return {
                mesAtual: this.feriasVencidas,
                mesProximo: this.feriasProximoMes,
                mesPosterior: this.feriasMesPosterior
            };
        }
    }

    try {
        const ferias = new Ferias();
        const dados = await ferias.buscarTodos();
        res.json(dados);
    } catch (erro) {
        console.error('Erro ao buscar férias:', erro);
        res.status(500).json({ error: 'Erro ao buscar férias' });
    }
}
