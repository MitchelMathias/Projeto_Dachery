const connection = require('./bancodados.js');

module.exports = async (req,res)=>{
    const {ids} = req.body
    let parametros = ''
    
    for(let i in ids){
        parametros += '?'
        if (i < ids.length - 1){
            parametros += ','
        }
    }
    const query = `DELETE FROM funcionarios WHERE id IN (${parametros})`
    connection.query(query,ids,(erro,resultado)=>{
        if(erro){
            res.json('erro')
        }
        else{
            res.json('ok')
        }
    })
}