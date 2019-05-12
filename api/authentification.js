const {authSecret} = require('../.env');
const jwt = require ('jwt-simple');
const bcrypt = require('bcrypt-nodejs');

module.exports = app => {
    //Metodo para efetuar login
    const signin = async (req, res) => {
        if(!req.fields.login || !req.fields.password){
            return res.status(400).send('Informe usuario e senha')
        }

        const student = await app.db('aluno')
            .where({nm_email: req.fields.login} || {cd_cpf: req.fields.login})
            .first()
        
        const teacher = await app.db('professor')
            .where({nm_email: req.fields.login} || {cd_cpf: req.fields.login})
            .first()
        
        if(!student && !teacher) return res.status(400).send('Usuario não encontrado')

        const user = {}

        if(teacher != null){  
            user.cpf = teacher.cd_cpf
            user.name = teacher.nm_nome
            user.email = teacher.nm_email
            user.password = teacher.cd_senha
            user.teacher = true
        }else{
            user.cpf = student.cd_cpf
            user.name = student.nm_nome
            user.email = student.nm_email
            user.password = student.cd_senha
            user.teacher = false
        }

        const isMatch = bcrypt.compareSync(req.fields.password, user.password)
        if (!isMatch) return res.status(401).send('Email/Senha invalidos')
        
        const now = Math.floor(Date.now()/1000)

        const payload = {
            cpf: user.cpf,
            name: user.name,
            email: user.email,
            teacher: user.teacher,
            iat: now,
            exp: now + (60 * 60 * 24)
        }
        
        res.json({
            ...payload,
            token: jwt.encode(payload, authSecret)
        })
    }

    //Validando o token recebido
    const validateToken = async (req, res) => {
        const userData = req.fields || null
        try {
            if(userData){
                const token = jwt.decode(userData.token, authSecret)
                if(new Date(token.exp * 1000 > new Date())){
                    return res.send(true)
                }
            }
            
        } catch (error) {
            
        }
        res.send(false)
    }
    
    return {signin, validateToken}
}