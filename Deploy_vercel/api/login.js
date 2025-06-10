const connection = require('./bancodados.js');

module.exports = (req, res) => {
    if (req.method === 'POST') {
        const { username, password } = req.body;

        const query = 'SELECT * FROM usuarios WHERE usuario = ? AND senha = ?';
        connection.query(query, [username, password], (erro, resposta) => {
            if (erro) {
                res.status(500).json({ error: 'Erro na consulta' });
            } else if (resposta.length > 0) {
                res.json({ status: 'ok' });
            } else {
                res.json({ status: 'nops' });
            }
        });
    } else {
        res.status(405).json({ error: 'Método não permitido' });
    }
};
