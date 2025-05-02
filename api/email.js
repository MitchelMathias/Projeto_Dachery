const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mitchelmathias2904@gmail.com',
        pass: 'xpfj rspo gjaj ryci', // senha de app do Gmail
    },
});

app.post('/enviar', (req, res) => {
    const { nome, email, tel, mensagem } = req.body;

    const mailOptions = {
        from: 'mitchelmathias2904@gmail.com',
        to: 'mitchel.mathias.dev@gmail.com',
        subject: 'Nova Solicitação de Contato - Dachery Transportes',
        text: `Nome: ${nome}\nEmail: ${email}\nTelefone: ${tel}\nMensagem: ${mensagem}`
    };

    transporter.sendMail(mailOptions, (err) => {
        if (err) return res.status(500).send('Erro: ' + err.message);
        res.send('E-mail enviado com sucesso!');
    });
});

app.listen(5000, () => console.log('Servidor na porta 5000'));
