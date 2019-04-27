const app = require('express')(); //Trabalhar com requisição
const consig = require ('consign'); //Ajuda a trabalhar com dependencias, aplicando a mesma apenas uma vez no arquivo
const db = require('./config/db'); //Banco de dados

app.db = db;

consig()
    .include('./config/passport.js')
    .then('./config/middlewares.js') //bodyParse e cors 
    .then('./api/validation.js') //Validações de campos
    .then('./api')
    .then('./config/routes.js') //Rotas de navegação
    .into(app)

app.listen(3002, () =>{
    console.log('Backend em Execução');
})