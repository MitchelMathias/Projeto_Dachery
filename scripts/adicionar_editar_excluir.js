function adicionar(){
    const express = require('express');
    const mysql = require('mysql');
    const cors = require('cors');

    const db = mysql.createConnection({
        host: 'mysql.dachery.com.br',
        user: 'dachery01',
        password: 'Madafock11',
        database: 'dachery01'
    })

    db.connect((err) => {});

    const query = "INSERT INTO funcionarios (nome, ultima_ferias, aniversario, ata_medica) VALUES (?, ?, ?, ?)";
    const valores = [ 'Eduarda', '2025-04-01', '1998-04-29', '2023-10-01'];

    db.query(query, valores, (err, results) => {
        if (err) {
            console.error('Erro ao inserir dados:', err);
            return;
        }
        console.log('Dados inseridos com sucesso:', results);
    });
}

adicionar()