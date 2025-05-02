const nodemailer = require('nodemailer');

export default async function handler(req, res) {
    // Configuração CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método não permitido' });
    }

    const { nome, email, telefone, mensagem } = req.body;

    // Configuração direta (NÃO FAÇA ISSO EM PRODUÇÃO)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'mitchelmathias2904@gmail.com',
            pass: 'xpfj rspo gjaj ryci',
        },
    });

    try {
        await transporter.sendMail({
            from: 'mitchelmathias2904@gmail.com',
            to: 'mitchel.mathias.dev@gmail.com',
            subject: 'Nova Solicitação de Contato - Dachery Transportes',
            text: `Nome: ${nome}\nEmail: ${email}\nTelefone: ${telefone}\nMensagem: ${mensagem}`,
        });
        res.status(200).json({ message: 'E-mail enviado com sucesso!' });
    } catch (err) {
        console.error('Erro:', err);
        res.status(500).json({ message: 'Erro ao enviar e-mail' });
    }
}