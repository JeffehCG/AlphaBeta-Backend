module.exports = app => {
    const {existsOrError, notExistsOrError} = app.api.validation;

    //Inserindo Vinculação do exercicio com a turma

    const insert = async (req, res) => {
        const exerciseToClass = {...req.fields}

        try {
            existsOrError(exerciseToClass.cd_exercicio, 'Codigo do exercicio não informado');
            existsOrError(exerciseToClass.cd_turma, 'Codigo da turma não informado');

            let duplicate = await app.db('inclcompfrase')
                .where({cd_exercicio: exerciseToClass.cd_exercicio, cd_turma: exerciseToClass.cd_turma}).first()
                notExistsOrError(duplicate, 'Exercicio ja esta vinculado')

        } catch (msg) {
            return res.status(400).send(msg);
        }

        app.db('inclcompfrase')
            .insert(exerciseToClass)
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
    }

    //Removendo vinculação com exercicio
    const remove = async (req, res) => {
        try {
            const rowsDeleted = await app.db('inclcompfrase')
                .where({cd_exercicio: req.params.idExer, cd_turma: req.params.idClass}).del()
                try {
                    existsOrError(rowsDeleted, 'Vinculação não encontrada')
                } catch (msg) {
                    res.status(400).send(msg)
                }

            res.status(204).send()
        } catch (msg) {
            res.status(500).send(msg)
        }
    }

    return{insert, remove}
}