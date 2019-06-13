module.exports = app => {
    const {existsOrError, notExistsOrError, equalsOrError} = app.api.validation;

    //Pegandos status do Professor no sistema
    const getStatsTeacher = async (req, res) => {
        let cpf = req.params.cpf

        let qtExercise
        let qtClassrom
        let qtStudents

        let result = await app.db('excompfrase')
            .where({cd_professor: cpf})
            .count('cd_professor')
            .first()
        for (let y in result){
            qtExercise = parseInt(result[y])
        }

        result = await app.db('turma')
            .where({cd_cpf_professor: cpf})
            .count('cd_cpf_professor')
            .first()
        for (let y in result){
            qtClassrom = parseInt(result[y])
        }

        result = await app.db({p: 'professor', m: 'matricula', t:'turma'})
            .whereRaw('?? = ??', ['m.cd_turma', 't.cd_turma'])
            .whereRaw('?? = ??', ['p.cd_cpf', 't.cd_cpf_professor'])
            .where({cd_cpf_professor: cpf})
            .countDistinct('m.cd_cpf_aluno')
            .first()
        for (let y in result){
            qtStudents = parseInt(result[y])
        }
        
        return res.json({qtExercise,qtClassrom,qtStudents})
    }

    //Pegandos status do Aluno no sistema
    const getStatsStudent = async (req, res) => {
        let cpf = req.params.cpf

        let qtExercise
        let qtClassrom
        let qtExercisesFineshed

        let result = await app.db('exercicioconcaluno')
            .where({cd_cpf_aluno: cpf})
            .countDistinct('cd_exercicio')
            .first()
        for (let y in result){
            qtExercisesFineshed = parseInt(result[y])
        }

        result = await app.db('matricula')
            .where({cd_cpf_aluno: cpf})
            .count('cd_cpf_aluno')
            .first()
        for (let y in result){
            qtClassrom = parseInt(result[y])
        }

        result = await app.db({ e: 'excompfrase',  i: 'inclcompfrase',  t: 'turma',  m: 'matricula',  a: 'aluno'})
            .whereRaw('?? = ??', ['e.cd_exercicio', 'i.cd_exercicio'])
            .whereRaw('?? = ??', ['t.cd_turma' , 'i.cd_turma'])
            .whereRaw('?? = ??', ['t.cd_turma' , 'm.cd_turma' ])
            .whereRaw('?? = ??', ['m.cd_cpf_aluno' , 'a.cd_cpf'])
            .where('a.cd_cpf', cpf)
            .count('e.cd_exercicio')
            .first()
        for (let y in result){
            qtExercise = parseInt(result[y])
        }
        
        return res.json({qtExercise,qtClassrom,qtExercisesFineshed})
    }

    return {getStatsTeacher,getStatsStudent}    
}