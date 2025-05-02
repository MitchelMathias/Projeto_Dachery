const nodemailer = require('nodemailer');

export default async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'OPTIONS') return res.status(200).end();

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método não permitido' });
    }

    try {
        const { nome, email, telefone, mensagem } = req.body;
        
        // Validação básica
        if (!nome || !email || !telefone || !mensagem) {
            return res.status(400).json({ message: 'Preencha todos os campos' });
        }

        // Transporter com tratamento de erro explícito
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'mitchelmathias2904@gmail.com',
                pass: 'xpfj rspo gjaj ryci',
            },
        });

        // Verifica conexão com o Gmail
        await transporter.verify().catch(error => {
            throw new Error(`Erro na conexão com o Gmail: ${error.message}`);
        });

        // Envio do e-mail
        await transporter.sendMail({
            from: '"Dachery Transportes" <mitchelmathias2904@gmail.com>',
            to: 'mitchel.mathias.dev@gmail.com',
            subject: 'Nova Solicitação de Contato',
            text: `Nome: ${nome}\nEmail: ${email}\nTelefone: ${telefone}\nMensagem: ${mensagem}`,
        });

        res.status(200).json({ message: 'E-mail enviado com sucesso!' });

    } catch (err) {
        console.error('Erro detalhado:', err);
        res.status(500).json({
            message: 'Erro no servidor',
            error: err.message // Apenas para desenvolvimento
        });
    }
}