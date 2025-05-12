const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const mysql = require('mysql');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/email', async (req, res) => {
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

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const connection = mysql.createConnection({
        host: 'mysql.dachery.com.br',
        user: 'dachery01',
        password: 'Madafock11',
        database: 'dachery01'
    });

    connection.connect(err => {
        if (err) {
            res.status(500).json({ error: 'Erro ao conectar ao banco' });
            return;
        }
    });

    const query = 'SELECT * FROM usuarios WHERE usuario = ? AND senha = ?';
    connection.query(query, [username, password], (erro, resposta) => {
        if (erro) {
            res.status(500).json({ error: 'Erro na consulta' });
        } else if (resposta.length > 0) {
            res.json({ status: 'ok' });
        } else {
            res.json({status: 'nops'})
        }
        connection.end();
    });
});

app.listen(3001, () => console.log('API na porta 3001'));
