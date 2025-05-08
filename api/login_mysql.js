const mysql   = require('mysql');           // driver MySQL
const express = require('express');
const cors = require('cors')         // servidor web
const app     = express();

// lê JSON do corpo
app.use(cors());                // libera CORS
app.use(express.json());        // lê JSON
app.use(express.static('api'));

// conecta no banco
const db = mysql.createConnection({
    host:     'mysql.dachery.com.br',
    user:     'dachery01',
    password: 'Madafock11',
    database: 'dachery01'
})
db.connect(err => {
    if (err) {
        console.error('Erro ao conectar:', err)
        process.exit(1)
    }
    console.log('Banco conectado')
})

// rota que recebe o fetch do front
app.post('/api/login', (req, res) => {
    const nome  = req.body.nome    // pega campo "nome" do JSON
    const senha = req.body.senha   // pega campo "senha" do JSON

    console.log(nome, senha)       // mostra no console do back

    res.sendStatus(200)            // responde OK pro front
})

app.listen(3000, () => console.log('Server na porta 3000'))
