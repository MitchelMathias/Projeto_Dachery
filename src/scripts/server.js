const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const mysql = require('mysql');
const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium');

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

const path = require('path');

app.use(express.static(path.join(__dirname, '..')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.post('/email', async (req, res) => {
    try {
        const { nome, email, tel, mensagem } = req.body;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'mitchelmathias2904@gmail.com',
                pass: 'xpfjrspogjajryci'
            }
        });

        const htmlEmail = `
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8" />
                <title>Novidades do Blog</title>
            </head>
            <body style="margin:0;padding:0;background-color:#f0f0f5;font-family:Arial,sans-serif;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f0f0f5;padding:40px 0;">
                    <tr>
                        <td align="center">
                            <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 0 10px rgba(0,0,0,0.05);">
                                <tr>
                                    <td style="background:#007BFF;padding:20px;color:#fff;text-align:center;">
                                        <h1 style="margin:0;font-size:24px;">📰 Contato do Site Dachery</h1>
                                        <p style="margin:5px 0 0;font-size:14px;">Mensagem recebida do formulário de contato</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:20px;">
                                        <h3 style="color:#007BFF;">Dados do Contato:</h3>
                                        <p><strong>Nome:</strong> ${nome}</p>
                                        <p><strong>Email:</strong> ${email}</p>
                                        <p><strong>Telefone:</strong> ${tel}</p>
                                        <p><strong>Mensagem:</strong><br />${mensagem}</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:20px;border-top:1px solid #eaeaea;text-align:center;font-size:12px;color:#999;">
                                        Você recebeu este e-mail porque alguém preencheu o formulário no site Dachery.
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
        `;

        await transporter.sendMail({
            from: '"Dachery" <mitchelmathias2904@gmail.com>',
            to: 'mitchel.mathias.dev@gmail.com',
            subject: 'Contato do site Dachery',
            html: htmlEmail
        });

        res.json({ message: 'Email enviado com sucesso' });

    } catch (e) {
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
            res.send(resposta)
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

app.get('/dado', async (req, res) => {
    let dado = 'Extração pendente';

    async function extrair() {
        let browser;
        try {
            browser = await puppeteer.launch({
                args: chromium.args,
                defaultViewport: chromium.defaultViewport,
                executablePath: await chromium.executablePath(), // pega o path do Chrome compatível
                headless: chromium.headless,
            });

            const page = await browser.newPage();
            await page.setUserAgent('Mozilla/5.0');

            await page.goto(
                'https://auth.conectcar.com/auth/realms/Atacado/protocol/openid-connect/auth?client_id=portal-atacado-web&scope=openid%20email%20profile&response_type=code&redirect_uri=https%3A%2F%2Fcliente-frotas.conectcar.com%2Fapi%2Fauth%2Fcallback%2Fkeycloak&state=BYXLl_zClxVuXNnJtIap-hG9RMazGyC3Jb85z-_sWWk&code_challenge=cO4VVOMDg1QOztW3sFM_S3Qm2VHXIrKrHfk6OCVG0qI&code_challenge_method=S256',
                { waitUntil: 'networkidle2' }
            );

            await page.type('input[name="username"]', 'paulo@dachery.com.br');
            await page.type('input[name="password"]', 'Dachery@123');

            await Promise.all([
                page.click('button[type="submit"]'),
                page.waitForNavigation({ waitUntil: 'networkidle2' }),
            ]);

            await page.goto('https://cliente-frotas.conectcar.com/home', { waitUntil: 'networkidle2' });
            await page.waitForSelector('.font-bold.text-blue-4');

            dado = await page.$eval('.font-bold.text-blue-4', el => el.textContent.trim());
            console.log('Dado extraído:', dado);

            await browser.close();
        } catch (err) {
            console.error('Erro na extração:', err);
            dado = err.stack || err.message;
            if (browser) await browser.close();
        }
    }

    await extrair();
    res.send(dado);
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
