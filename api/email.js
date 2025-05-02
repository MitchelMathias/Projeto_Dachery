import nodemailer from "nodemailer";

export default async (req, res) => {
    if (req.method !== "POST") return res.status(405).end();

    const { nome, email, telefone, mensagem } = req.body;

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "mitchelmathias2904@gmail.com",
            pass: "xpfj rspo gjaj ryci"
        }
    });

    try {
        await transporter.sendMail({
            from: email,
            to: "mitchel.mathias.dev@gmail.com",
            subject: "Nova mensagem",
            text: `${nome} - ${telefone}\n\n${mensagem}`
        });

        res.status(200).json({ ok: true });
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message });
    }
};
