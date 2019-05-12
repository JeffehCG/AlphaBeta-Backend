const bcrypt = require('bcrypt-nodejs') //Criptogragar senha

module.exports = app => {
    const {existsOrError, notExistsOrError, equalsOrError} = app.api.validation;

    //Criptografando senha
    const encryPassword = password => {
        const salt = bcrypt.genSaltSync(10); //Sempre mudar hash
        return bcrypt.hashSync(password,salt);
    }

    //inserindo aluno
    const insert = async (req, res) => {
        const student = {...req.fields};
        
        //validações
        try {
            existsOrError(student.nm_nome, 'Nome não informado');
            existsOrError(student.cd_cpf, 'CPF não informado');
            existsOrError(student.nm_email, 'E-mail não informado');
            existsOrError(student.cd_senha, 'Senha não informada');
            existsOrError(student.cd_confSenha, 'Confirmação de senha não informada');

            equalsOrError(student.cd_confSenha, student.cd_senha, 'Senhas não conferem');

            const duplicateEmailSt = await app.db('aluno')
                .where({nm_email: student.nm_email}).first();
            const duplicateCpfSt = await app.db('aluno')
                .where({cd_cpf: student.cd_cpf}).first();

            notExistsOrError(duplicateEmailSt, 'Email já cadastrado');
            notExistsOrError(duplicateCpfSt, 'CPF já cadastrado')

            const duplicateEmailTe = await app.db('professor')
                .where({nm_email: student.nm_email}).first();
            const duplicateCpfTe = await app.db('professor')
                .where({cd_cpf: student.cd_cpf}).first();

            notExistsOrError(duplicateEmailTe, 'Email já cadastrado');
            notExistsOrError(duplicateCpfTe, 'CPF já cadastrado')
        } catch (msg) {
            return res.status(400).send(msg);
        }

        student.cd_senha = encryPassword(student.cd_senha)
        delete student.cd_confSenha

        app.db('aluno')
            .insert(student)
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
    }

    //Alterando aluno
    const update = async (req, res) => {
        const student = {...req.fields};
        student.cd_cpf = req.params.cpf
        
        //validações
        try {
            existsOrError(student.nm_nome, 'Nome não informado');
            existsOrError(student.cd_cpf, 'CPF não informado');
            existsOrError(student.nm_email, 'E-mail não informado');
            existsOrError(student.cd_senha, 'Senha não informada');

        } catch (msg) {
            return res.status(400).send(msg);
        }

        app.db('aluno')
            .update(student)
            .where({cd_cpf: student.cd_cpf})
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
    }

    //Listando alunos
    const get = (req, res) => {
        app.db('aluno')
            .select('cd_cpf', 'nm_nome', 'nm_email')
            .then(students => res.json(students))
            .catch(err => res.status(500).send(err))
    }

    //Listar aluno pelo id 
    const getById = (req,res) => {
        const cpf = req.params.cpf
        
        app.db('aluno')
            .where({cd_cpf: cpf})
            .first()
            .then(student => res.json(student))
            .catch(err => res.status(500).send(err))
    }

    //Listando turmas de um aluno
    const getAllClassStudent = (req,res) => {
        cpf = req.params.cpf
        app.db({a: 'aluno', p: 'professor', m: 'matricula', t:'turma'})
            .select('p.nm_nome', 'p.nm_sobrenome', 'p.nm_email', 'm.dt_matricula', 't.aa_inicio', 't.nivel_turma', 't.cd_turma', 't.cd_cpf_professor')
            .whereRaw('?? = ??', ['a.cd_cpf', 'm.cd_cpf_aluno'])
            .whereRaw('?? = ??', ['p.cd_cpf', 't.cd_cpf_professor'])
            .whereRaw('?? = ??', ['m.cd_turma', 't.cd_turma'])
            .where('a.cd_cpf', cpf)
            .then(classroom => res.json(classroom))
            .catch(err => res.status(500).send(err))
        }

        const getAllExerciseStudent = (req,res) => {
            cpf = req.params.cpf
            app.db({ e: 'excompfrase',  i: 'inclcompfrase',  t: 'turma',  m: 'matricula',  a: 'aluno'})
                .select('e.cd_exercicio','e.ds_texto', 'e.nm_url', 'e.cd_professor', 'e.ds_classificacao')
                .whereRaw('?? = ??', ['e.cd_exercicio', 'i.cd_exercicio'])
                .whereRaw('?? = ??', ['t.cd_turma' , 'i.cd_turma'])
                .whereRaw('?? = ??', ['t.cd_turma' , 'm.cd_turma' ])
                .whereRaw('?? = ??', ['m.cd_cpf_aluno' , 'a.cd_cpf'])
                .where('a.cd_cpf', cpf)
                .then(classroom => res.json(classroom))
                .catch(err => res.status(500).send(err))
            }

    return {get,getById, insert, update, getAllClassStudent,getAllExerciseStudent}    
}