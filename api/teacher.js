const bcrypt = require('bcrypt-nodejs') //Criptogragar senha

module.exports = app => {
    const {existsOrError, notExistsOrError, equalsOrError} = app.api.validation;

    //Criptografando senha
    const encryPassword = password => {
        const salt = bcrypt.genSaltSync(10); //Sempre mudar hash
        return bcrypt.hashSync(password,salt);
    }

    //inserindo professor
    const insert = async (req, res) => {
        const teacher = {...req.fields};
        
        //validações
        try {
            existsOrError(teacher.nm_nome, 'Nome não informado');
            existsOrError(teacher.cd_cpf, 'CPF não informado');
            existsOrError(teacher.nm_email, 'E-mail não informado');
            existsOrError(teacher.cd_senha, 'Senha não informada');
            existsOrError(teacher.cd_confSenha, 'Confirmação de senha não informada');

            equalsOrError(teacher.cd_confSenha, teacher.cd_senha, 'Senhas não conferem');

            //Verificação de email e cpf duplicado
            const duplicateEmailTe = await app.db('professor')
                .where({nm_email: teacher.nm_email}).first();
            const duplicateCpfTe = await app.db('professor')
                .where({cd_cpf: teacher.cd_cpf}).first();

            notExistsOrError(duplicateEmailTe, 'Email já cadastrado');
            notExistsOrError(duplicateCpfTe, 'CPF já cadastrado')

            //Verificação de email e cpf duplicado na tabela aluno
            const duplicateEmailSt = await app.db('aluno')
                .where({nm_email: teacher.nm_email}).first();
            const duplicateCpfSt = await app.db('aluno')
                .where({cd_cpf: teacher.cd_cpf}).first();

            notExistsOrError(duplicateEmailSt, 'Email já cadastrado');
            notExistsOrError(duplicateCpfSt, 'CPF já cadastrado')
        } catch (msg) {
            return res.status(400).send(msg);
        }

        teacher.cd_senha = encryPassword(teacher.cd_senha)
        delete teacher.cd_confSenha

        app.db('professor')
            .insert(teacher)
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
    }

    //Alterando professor
    const update = async (req, res) => {
        const teacher = {...req.fields};
        teacher.cd_cpf = req.params.cpf
        
        //validações
        try {
            existsOrError(teacher.nm_nome, 'Nome não informado');
            existsOrError(teacher.cd_cpf, 'CPF não informado');
            existsOrError(teacher.nm_email, 'E-mail não informado');
            existsOrError(teacher.cd_senha, 'Senha não informada');

        } catch (msg) {
            return res.status(400).send(msg);
        }

        app.db('professor')
            .update(teacher)
            .where({cd_cpf: teacher.cd_cpf})
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
    }

    //Listando professors
    const get = (req, res) => {
        app.db('professor')
            .select('cd_cpf', 'nm_nome', 'nm_email')
            .then(teachers => res.json(teachers))
            .catch(err => res.status(500).send(err))
    }

    //Listar professor pelo id 
    const getById = (req,res) => {
        const cpf = req.params.cpf
        
        app.db('professor')
            .where({cd_cpf: cpf})
            .first()
            .then(teacher => res.json(teacher))
            .catch(err => res.status(500).send(err))
    }

    //Listando turmas pelo cpf do professor
    const getAllClassTeacher = (req, res) => {
        cpf = req.params.cpf
        const page = req.query.page || 1

        const limit = 5

        app.db('turma')
            .limit(limit).offset(page * limit - limit)
            .where({cd_cpf_professor: cpf})
            .then(classroom => res.json(classroom))
            .catch(err => res.status(500).send(err))
    }

    const searchClassTeacher = (req, res) => {
        cpf = req.params.cpf
        const search = {...req.fields};
        try {
            existsOrError(search.field, 'Campo não informado');
            existsOrError(search.content, 'Pesquisa vazia');
        } catch (msg) {
            return res.status(400).send(msg);
        }

        app.db('turma')
            .where({cd_cpf_professor: cpf})
            .where(search.field, search.content)
            .then(classroom => res.json(classroom))
            .catch(err => res.status(500).send(err))
    }

    //Pegando todos exercicios vinculados com determinado professor
    const getExercisesByCpfTeacher = async (req, res) => {
        const cpf = req.params.cpf
        const page = req.query.page || 1
        const classes = req.query.classes
        
        let limit
        if(classes){
            limit = 10
            const result = await app.db('excompfrase').where({cd_professor: cpf}).count('cd_exercicio').first() 
            let count
            for (let y in result){
                count = parseInt(result[y])
            }
            app.db('excompfrase')
                .limit(limit).offset(page * limit - limit)
                .where({cd_professor: cpf})
                .then(exercises => res.json({data : exercises, count, limit}))
                .catch(err => res.status(500).send(err))
        }else{
            limit = 5
            app.db('excompfrase')
                .limit(limit).offset(page * limit - limit)
                .where({cd_professor: cpf})
                .then(exercises => res.json(exercises))
                .catch(err => res.status(500).send(err))
        }
    }

    const searchExercisesByCpfTeacher = async (req, res) => {
        const cpf = req.params.cpf
        const search = {...req.fields}; 

        try {
            existsOrError(search.field, 'Campo não informado');
            existsOrError(search.content, 'Pesquisa vazia');
        } catch (msg) {
            return res.status(400).send(msg);
        }

        app.db('excompfrase')
            .where({cd_professor: cpf})
            .where(search.field, search.content)
            .then(exercises => res.json(exercises))
            .catch(err => res.status(500).send(err))
    }

    return {get,getById, insert, update, getAllClassTeacher,getExercisesByCpfTeacher,searchExercisesByCpfTeacher,searchClassTeacher}    
}