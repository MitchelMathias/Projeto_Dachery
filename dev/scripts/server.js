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




app.listen(3001, () => console.log('API na porta 3001'));
