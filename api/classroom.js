module.exports = app => {
    const {existsOrError, notExistsOrError} = app.api.validation;

    //inserindo Turma
    const insert = async (req, res) => {
        const classroom = {...req.body};
        
        //validações
        try {
            existsOrError(classroom.nivel_turma, 'Nivel da turma não informado');
            existsOrError(classroom.cd_cpf_professor, 'CPF do professor não informado');
            existsOrError(classroom.aa_inicio, 'Ano de inicio não informado');

        } catch (msg) {
            return res.status(400).send(msg);
        }

        app.db('turma')
            .insert(classroom)
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
    }

    //Alterando turma
    const update = async (req, res) => {
        const classroom = {...req.body};
        id = req.params.id
        
        //validações
        try {
            existsOrError(classroom.nivel_turma, 'Nivel da turma não informado');
            existsOrError(classroom.cd_cpf_professor, 'CPF do professor não informado');
            existsOrError(classroom.aa_inicio, 'Ano de inicio não informado');

        } catch (msg) {
            return res.status(400).send(msg);
        }

        app.db('turma')
            .update(classroom)
            .where({cd_turma: id})
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
    }

    //Removendo turma
    const remove = async (req, res) => {
        const id = req.params.id

        try {
            const students = await app.db('matricula')
                .where({cd_turma: id}).first()
            notExistsOrError(students, 'Contem alunos matriculados')

            const exercises = await app.db('inclcompfrase')
                .where({cd_turma: id}).first()
            notExistsOrError(exercises, 'Contem exercicios vinculados')
        } catch (msg) {
            return res.status(400).send(msg);
        }

        app.db('turma')
            .where({cd_turma: id})
            .del()
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
    }

    //Listando turma pelo id
    const getById = (req,res) => {
        const id = req.params.id
        
        app.db('turma')
            .where({cd_turma: id})
            .first()
            .then(classroom => res.json(classroom))
            .catch(err => res.status(500).send(err))
    }

    //Listando todos alunos da turma

    const getAllStudents = (req,res) => {
        id = req.params.id
        app.db({a: 'aluno', m: 'matricula', t:'turma'})
            .select('a.nm_nome', 'a.nm_sobrenome', 'a.cd_cpf', 'a.nm_email')
            .whereRaw('?? = ??', ['a.cd_cpf', 'm.cd_cpf_aluno'])
            .whereRaw('?? = ??', ['m.cd_turma', 't.cd_turma'])
            .where('t.cd_turma', id)
            .then(classroom => res.json(classroom))
            .catch(err => res.status(500).send(err))
    }

    //Listando todos exercicios da turma 
    const getAllExercises = (req, res) => {
        id = req.params.id
        app.db({e: 'excompfrase', t: 'turma', p: 'inclcompfrase'})
            .select('e.cd_exercicio','e.ds_texto', 'e.nm_url', 'e.cd_professor', 'e.ds_classificacao')
            .whereRaw('?? = ??', ['e.cd_exercicio', 'p.cd_exercicio'])
            .whereRaw('?? = ??', ['t.cd_turma', 'p.cd_turma'])
            .where('t.cd_turma', id)
            .then(classroom => res.json(classroom))
            .catch(err => res.status(500).send(err))
    }

    return {insert, update, getAllStudents, getById,getAllExercises, remove}    
}