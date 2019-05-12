module.exports = app => {
    const {existsOrError, notExistsOrError} = app.api.validation;

    //inserindo Matricula
    const insert = async (req, res) => {
        const enrollment = {...req.fields};
        
        //validações
        try {
            existsOrError(enrollment.cd_cpf_aluno, 'CPF do aluno não informado');
            existsOrError(enrollment.cd_turma, 'Codigo da turma não informado');

            let duplicateEnrollment = await app.db('matricula')
                .where({cd_cpf_aluno: enrollment.cd_cpf_aluno, cd_turma: enrollment.cd_turma}).first()
            notExistsOrError(duplicateEnrollment, 'Aluno já esta matriculado')

        } catch (msg) {
            return res.status(400).send(msg);
        }

        enrollment.dt_matricula = new Date()
        enrollment.ic_estado_matricula = 'ativo'

        app.db('matricula')
            .insert(enrollment)
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
    }

    //Removendo matricula
    const remove = async (req, res) => {
        try {
            const rowsDeleted = await app.db('matricula')
                .where({cd_cpf_aluno: req.params.cpf, cd_turma: req.params.id}).del()
                try {
                    existsOrError(rowsDeleted, 'Matricula não encontrada')
                } catch (msg) {
                    res.status(400).send(msg)
                }

            res.status(204).send()
        } catch (msg) {
            res.status(500).send(msg)
        }
    }

    

    return {insert,remove}    
}