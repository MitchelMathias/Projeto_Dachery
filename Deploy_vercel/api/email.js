const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    try {
        const { nome, email, tel, mensagem } = req.body;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'mitchelmathias2904@gmail.com',
                pass: 'xpfjrspogjajryci' // cuidado com expor isso em repositórios públicos!
            }
        });

        await transporter.sendMail({
            from: '"Dachery" <mitchelmathias2904@gmail.com>',
            to: 'mitchel.mathias.dev@gmail.com',
            subject: 'Contato do site',
            text: `Nome: ${nome}\nEmail: ${email}\nTelefone: ${tel}\nMensagem: ${mensagem}`
        });

        res.json({ message: 'Email enviado com Sucesso' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
};
