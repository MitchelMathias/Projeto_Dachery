const connection = require('./bancodados.js');
const nodemailer = require('nodemailer');


module.exports = async (req, res) => {
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
}