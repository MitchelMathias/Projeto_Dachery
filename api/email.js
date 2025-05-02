const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

// Middleware para parsear o corpo da requisição
app.use(bodyParser.urlencoded({ extended: true }));

// Configuração do transporte para enviar o e-mail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mitchelmathias2904@gmail.com',
        pass: 'xpfj rspo gjaj ryci', // Senha do app (não a senha do Gmail)
    },
});

// Função para processar o formulário e enviar o e-mail
app.post('/enviar', (req, res) => {
    const { nome, email, tel, mensagem } = req.body;

    // Montar a mensagem
    const emailContent = `
        Nova solicitação de contato:

        Nome: ${nome}
        E-mail: ${email}
        Telefone: ${tel}
        Mensagem: ${mensagem}
    `;

    // Configurar e enviar o e-mail
    const mailOptions = {
        from: 'mitchelmathias2904@gmail.com',
        to: 'mitchelmathias2904@gmail.com',
        subject: 'Nova Solicitação de Contato - Dachery Transportes',
        text: emailContent,
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            return res.status(500).send('Erro ao enviar e-mail: ' + err.message);
        }
        res.status(200).send('E-mail enviado com sucesso!');
    });
});

app.listen(port, () => {
    console.log(`Server rodando na porta ${port}`);
});
