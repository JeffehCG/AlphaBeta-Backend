const bodyParser = require('body-parser'); //Interpretar body requisição
const cors = require('cors'); //permitir que o backend acesse a api

module.exports = app => {
    app.use(bodyParser.json());
    app.use(cors());
}