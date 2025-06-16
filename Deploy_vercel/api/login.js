const connection = require('./bancodados.js');

module.exports = async  (req, res) => {
    const { username, password } = req.body;

    const query = 'SELECT * FROM usuarios WHERE usuario = ? AND senha = ?';
    connection.query(query, [username, password], (erro, resposta) => {
        if (erro) {
            res.status(500).json({ error: 'Erro na consulta' });
        } else if (resposta.length > 0) {
            res.send(resposta)
        } else {
            res.json({status: 'nops'})
        }
    });
}