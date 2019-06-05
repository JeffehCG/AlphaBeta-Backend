module.exports = app => {
    const {existsOrError, notExistsOrError} = app.api.validation;

    //Inserindo finalização 
    const insert = async (req, res) => {
        const paransFinished = {...req.fields};

        //validações
        try {
            existsOrError(paransFinished.cd_cpf_aluno, 'CPF do aluno não informado');
            existsOrError(paransFinished.cd_exercicio, 'Codigo do exercicio não informado');
            existsOrError(paransFinished.qt_erros, 'Quantidade de erros não informada')

        } catch (msg) {
            return res.status(400).send(msg);
        }

        paransFinished.dt_conclusao = new Date()

        app.db('exercicioconcaluno')
            .insert(paransFinished)
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
    }

    //Verificando exercicios concluidos
    const exerciceFinished = (req,res) => {
        const cpf = req.params.cpf
        const cdExercicio = req.params.cdExercicio

        app.db('exercicioconcaluno')
            .where({cd_cpf_aluno: cpf, cd_exercicio: cdExercicio})
            .first()
            .then(exerciceF => res.json(exerciceF))
            .catch(err => res.status(500).send(err))
    }

    return{insert, exerciceFinished}
}