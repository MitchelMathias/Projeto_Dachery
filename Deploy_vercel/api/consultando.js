const connection = require('./bancodados.js');

module.exports = async (req,res)=>{
    const {nome} = req.body
    
    const query = `SELECT * FROM funcionarios WHERE LOWER(nome) LIKE LOWER(CONCAT('%', ?, '%'))`
    connection.query(query,nome, (erro, resultados) => {
        if (erro) {
            res.status(500).json({ error: 'Erro na consulta' });
        } else {
            res.json(resultados)
        }
    });
}