const nodemailer = require('nodemailer');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).send({ message: 'Método não permitido' });
    }

    const { nome, email, telefone, mensagem } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'mitchelmathias2904@gmail.com',
            pass: 'xpfj rspo gjaj ryci',
        },
    });

    const mailOptions = {
        from: 'mitchelmathias2904@gmail.com',
        to: 'mitchel.mathias.dev@gmail.com',
        subject: 'Nova Solicitação de Contato - Dachery Transportes',
        text: `Nome: ${nome}\nEmail: ${email}\nTelefone: ${telefone}\nMensagem: ${mensagem}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'E-mail enviado com sucesso!' });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao enviar e-mail: ' + err.message });
    }
}
