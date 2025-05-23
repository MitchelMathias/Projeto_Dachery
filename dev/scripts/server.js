const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const mysql = require('mysql');

const app = express();
app.use(cors());
app.use(express.json());

const connection = mysql.createPool({
    host: 'mysql.dachery.com.br',
    user: 'dachery01',
    password: 'Madafock11',
    database: 'dachery01',
    connectionLimit: 10
});

app.post('/email', async (req, res) => {
    try {
        const {nome,email,tel,mensagem} = req.body;
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth:{
                user:'mitchelmathias2904@gmail.com',
                pass:'xpfjrspogjajryci'
            }

        })

        await transporter.sendMail({
            from: '"Dachery" <mitchelmathias2904@gmail.com>',
            to: 'mitchel.mathias.dev@gmail.com',
            subject: 'Contato do site',
            text: `Nome: ${nome}\nEmail: ${email}\nTelefone: ${tel}\nMensagem: ${mensagem}`
        })
        res.json({message: 'Email enviado com Sucesso'})
        
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const query = 'SELECT * FROM usuarios WHERE usuario = ? AND senha = ?';
    connection.query(query, [username, password], (erro, resposta) => {
        if (erro) {
            res.status(500).json({ error: 'Erro na consulta' });
        } else if (resposta.length > 0) {
            res.json({ status: 'ok' });
        } else {
            res.json({status: 'nops'})
        }
    });
});

app.post('/cadastrando', (req, res) => {
    const { nome, ultima_ferias, aniversario, ultima_ata } = req.body;

    const query = 'INSERT INTO funcionarios (nome, ultima_ferias, aniversario, ata_medica) VALUES (?, ?, ?, ?)';
    const valores = [nome, ultima_ferias, aniversario, ultima_ata];

    connection.query(query, valores, (erro, resultado) => {
        if (erro) {
            console.log('Erro no INSERT');
            res.status(500).json({ error: 'Erro na consulta' });
        } else {
            res.json({ status: 'ok', id_inserido: resultado.insertId });
        }
    });
});

app.post('/consultando',(req,res)=>{
    const {nome} = req.body
    
    const query = `SELECT * FROM funcionarios WHERE LOWER(nome) LIKE LOWER(CONCAT('%', ?, '%'))`
    connection.query(query,nome, (erro, resultados) => {
        if (erro) {
            res.status(500).json({ error: 'Erro na consulta' });
        } else {
            res.json(resultados)
        }
    });
})

app.post('/deletando',(req,res)=>{
    const {ids} = req.body
    let parametros = ''
    
    for(let i in ids){
        parametros += '?'
        if (i < ids.length - 1){
            parametros += ','
        }
    }
    const query = `DELETE FROM funcionarios WHERE id IN (${parametros})`
    connection.query(query,ids,(erro,resultado)=>{
        if(erro){
            res.json('erro')
        }
        else{
            res.json('ok')
        }
    })
})

app.get('/aniversariantes', async (req, res) => {
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
});

app.get('/ataMedica', async (req, res) => {
    class AtasMedicas {
        constructor() {
            const hoje = new Date();
            this.hoje = hoje;
            this.mes = hoje.getMonth(); // 0-11
            this.ano = hoje.getFullYear();
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
                } else if (
                    (vencimentoAno === this.ano && vencimentoMes === this.mes + 1) ||
                    (this.mes === 11 && vencimentoAno === this.ano + 1 && vencimentoMes === 0)
                ) {
                    this.atasProximoMes.push(vencInfo);
                } else if (
                    (vencimentoAno === this.ano && vencimentoMes === this.mes + 2) ||
                    (this.mes === 10 && vencimentoAno === this.ano + 1 && vencimentoMes === 0) ||
                    (this.mes === 11 && vencimentoAno === this.ano + 1 && vencimentoMes === 1)
                ) {
                    this.atasMesPosterior.push(vencInfo);
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
});

app.get('/ferias', async (req, res) => {
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
});



const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
