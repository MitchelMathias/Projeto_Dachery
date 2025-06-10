const connection = require('./bancodados.js');

module.exports = async (req, res) => {
    class AtasMedicas {
        constructor() {
            const hoje = new Date();
            this.hoje = hoje;
            this.ano = hoje.getFullYear();
            this.mes = hoje.getMonth(); // 0 a 11

            this.atasVencidas = [];
            this.atasProximoMes = [];
            this.atasMesPosterior = [];
        }

        formatarData(data) {
            return `${data.getDate().toString().padStart(2, '0')}/` +
                   `${(data.getMonth() + 1).toString().padStart(2, '0')}/` +
                   `${data.getFullYear()}`;
        }

        async carregarAtas() {
            return new Promise((resolve, reject) => {
                const query = 'SELECT * FROM funcionarios WHERE ata_medica IS NOT NULL';
                connection.query(query, (erro, resultado) => {
                    if (erro) return reject(erro);
                    resolve(resultado);
                });
            });
        }

        calcularVencimento(dataOriginal) {
            const venc = new Date(dataOriginal);
            venc.setMonth(venc.getMonth() + 6);
            return venc;
        }

        async classificarAtas() {
            const atas = await this.carregarAtas();
            const hoje = this.hoje;

            // Referência: mês atual
            const mesAtual = this.mes;
            const anoAtual = this.ano;

            atas.forEach(ata => {
                const dataOriginal = new Date(ata.ata_medica);
                const vencimento = this.calcularVencimento(dataOriginal);

                const vencimentoMes = vencimento.getMonth();
                const vencimentoAno = vencimento.getFullYear();

                const vencInfo = {
                    id: ata.id,
                    nome: ata.nome,
                    vencimento: this.formatarData(vencimento)
                };

                if (vencimento <= hoje) {
                    this.atasVencidas.push(vencInfo);
                } else {
                    const diffMeses = (vencimentoAno - anoAtual) * 12 + (vencimentoMes - mesAtual);

                    if (diffMeses === 1) {
                        this.atasProximoMes.push(vencInfo);
                    } else if (diffMeses === 2) {
                        this.atasMesPosterior.push(vencInfo);
                    }
                }
            });
        }

        async buscarTodos() {
            await this.classificarAtas();
            return {
                mesAtual: this.atasVencidas,
                mesProximo: this.atasProximoMes,
                mesPosterior: this.atasMesPosterior
            };
        }
    }

    try {
        const atas = new AtasMedicas();
        const dados = await atas.buscarTodos();
        res.json(dados);
    } catch (erro) {
        console.error('Erro ao buscar atas médicas:', erro);
        res.status(500).json({ error: 'Erro ao buscar atas médicas' });
    }
};
