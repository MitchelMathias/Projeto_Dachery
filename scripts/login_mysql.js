const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors({
    origin: 'http://127.0.0.1:5500' // Permite conexão do Live Server
}));
app.use(express.json());

// Conexão com o Banco de Dados
const db = mysql.createConnection({
    host: 'mysql.dachery.com.br',
    user: 'dachery01',
    password: 'Madafock11',
    database: 'dachery01'
});

db.connect(err => {
    if (err) {
        console.error('Erro no MySQL:', err);
        process.exit(1);
    }
    console.log('Conectado ao MySQL!');
});

// Rota de Login
app.post('/login', (req, res) => {
    const { usuario, senha } = req.body;
    
    db.query(
        'SELECT * FROM usuarios WHERE usuario = ? AND senha = ?',
        [usuario, senha],
        (err, results) => {
            if (err) {
                console.error('Erro na consulta:', err);
                return res.status(500).send('Erro no servidor');
            }
            
            if (results.length > 0) {
                res.status(200).send('Login válido');
            } else {
                res.status(401).send('Credenciais inválidas');
            }
        }
    );
});

// Inicie o servidor na porta 3000
app.listen(3000, () => console.log('Servidor rodando na porta 3000'));