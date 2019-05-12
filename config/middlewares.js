const bodyParser = require('body-parser'); //Interpretar body requisição
const cors = require('cors'); //permitir que o backend acesse a api
const formidable = require('express-formidable')

module.exports = app => {
    // app.use(bodyParser.json());
    app.use(formidable())
    app.use(cors());
}