const connection = require('./bancodados.js');

module.exports = async (req, res) => {
    const { nome, ultima_ferias, aniversario, ultima_ata } = req.body;

    const query = 'INSERT INTO funcionarios (nome, ultima_ferias, aniversario, ata_medica) VALUES (?, ?, ?, ?)';
    const valores = [nome, ultima_ferias, aniversario, ultima_ata];

    connection.query(query, valores, (erro, resultado) => {
        if (erro) {
            console.log('Erro no INSERT');
            res.status(500).json({ error: 'Erro na consulta' });
        } else {
            res.json({ status: 'ok', id_inserido: resultado.insertId });
        }
    });
}