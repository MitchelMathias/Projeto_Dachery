const connection = require('./bancodados.js');

module.exports = async (req, res) => {
    class Aniversariantes {
        constructor() {
            const date = new Date();
            this.dia = date.getDate();
            this.mes = date.getMonth() + 1;
            this.ano = date.getFullYear();
            this.aniversariantesMesAtual = [];
            this.aniversariantesMesProximo = [];
            this.aniversariantesMesPosterior = [];
        }
        
        buscarPorMes(mes) {
            return new Promise((resolve, reject) => {
                const query = 'SELECT * FROM funcionarios WHERE MONTH(aniversario) = ?';
                connection.query(query, [mes], (erro, resposta) => {
                    if (erro) return reject(erro);
                    const nomes = resposta.map(p => ({
                        nome:p.nome,
                        aniversario: `${new Date(p.aniversario).getDate().toString().padStart(2, '0')}/${(new Date(p.aniversario).getMonth()+1).toString().padStart(2, '0')}/${new Date(p.aniversario).getFullYear()}`
                    }));
                    resolve(nomes);
                });
            });
        }
        
        async mesAtual() {
            this.aniversariantesMesAtual = await this.buscarPorMes(this.mes);
        }
        
        async mesProximo() {
            const prox = this.mes + 1 > 12 ? 1 : this.mes + 1;
            this.aniversariantesMesProximo = await this.buscarPorMes(prox);
        }
        
        async mesPosterior() {
            const post = this.mes + 2 > 12 ? this.mes + 2 - 12 : this.mes + 2;
            this.aniversariantesMesPosterior = await this.buscarPorMes(post);
        }
        
        async buscarTodos() {
            await Promise.all([
                this.mesAtual(),
                this.mesProximo(),
                this.mesPosterior()
            ]);
            return {
                mesAtual: this.aniversariantesMesAtual,
                mesProximo: this.aniversariantesMesProximo,
                mesPosterior: this.aniversariantesMesPosterior
            };
        }
    }
    
    try {
        const aniversarios = new Aniversariantes();
        const dados = await aniversarios.buscarTodos();
        res.json(dados);
    } catch (erro) {
        console.error('Erro ao buscar aniversariantes:', erro);
        res.status(500).json({ error: 'Erro ao buscar aniversariantes' });
    }
}
