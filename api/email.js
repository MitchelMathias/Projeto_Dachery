const nodemailer = require('nodemailer');

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (req.method === 'POST') {
        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: { user: 'mitchelmathias2904@gmail.com', pass: 'xpfj rspo gjaj ryci' }
            });
            await transporter.sendMail({
                from: 'mitchelmathias2904@gmail.com',
                to: 'mitchel.mathias.dev@gmail.com',
                subject: 'Novo contato',
                text: `Nome: ${req.body.nome}\nEmail: ${req.body.email}\nMensagem: ${req.body.mensagem}`
            });
            res.status(200).json({ message: 'E-mail enviado!' });
        } catch (err) {
            res.status(500).json({ message: 'Falha no envio' });
        }
    }
}