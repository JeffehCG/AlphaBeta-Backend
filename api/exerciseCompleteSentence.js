module.exports = app => {

    const {existsOrError, notExistsOrError, equalsOrError} = app.api.validation;

    //Inserindo exercicio 
    const insertExercise = async (req , res) => {
        const exercise = {...req.fields}

        try {
            existsOrError(exercise.ds_texto, 'Frase não informada')
            existsOrError(exercise.nm_url, 'Url do exercicio não informada')
            existsOrError(exercise.cd_professor, 'Codigo do professor não informado')
            existsOrError(exercise.ds_classificacao, 'Classificação não informada')
            // existsOrError(exercise.parameters, 'Parametros não informados')
            
        } catch (msg) {
            return res.status(400).send(msg);
        }

        //Pegando os parametros do exericicio
        // const parameters = exercise.parameters
        delete exercise.parameters

        //Percorendo e validando os parametros
        // for(let i in parameters){
        //     try {
        //         existsOrError(parameters[i].nm_texto, 'Palavra não informada')
        //         existsOrError(parameters[i].ds_img, 'Imagem não informada') 
        //     } catch (msg) {
        //         return res.status(400).send(msg);
        //     }
        // }

        //Inserindo o exercicio
        await app.db('excompfrase')
            .insert(exercise)
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))

        // //Pegando o codigo do ultimo exercicio cadastrado pelo professor
        // let idLastExercise = await app.db('excompfrase')
        //     .where({cd_professor: exercise.cd_professor})
        //     .max('cd_exercicio')
        //     .first()
        // for (let y in idLastExercise){
        //     idLastExercise = idLastExercise[y]
        // }

        // //Inserindo os parametros
        // let idParams = 1
        // for(let x in parameters){
        //     parameters[x].cd_parametro = idParams
        //     parameters[x].cd_exercicio = idLastExercise
        //     idParams ++

        //     await app.db('prcompfrase')
        //         .insert(parameters[x])
        // }
    }

    //Alterando
    const updateExercise = async (req, res) => {
        const exercise = {...req.fields}
        exercise.cd_exercicio = req.params.id

        try {
            existsOrError(exercise.ds_texto, 'Frase não informada')
            existsOrError(exercise.nm_url, 'Url do exercicio não informada')
            existsOrError(exercise.cd_professor, 'Codigo do professor não informado')
            existsOrError(exercise.ds_classificacao, 'Classificação não informada')
            existsOrError(exercise.parameters, 'Parametros não informados')
            
        } catch (msg) {
            return res.status(400).send(msg);
        }

        //Pegando os parametros do exericicio
        const parameters = exercise.parameters
        delete exercise.parameters

        //Percorendo e validando os parametros
        for(let i in parameters){
            try {
                existsOrError(parameters[i].nm_texto, 'Palavra não informada')
                existsOrError(parameters[i].ds_img, 'Imagem não informada')
            } catch (msg) {
                return res.status(400).send(msg);
            }
        }

        //Inserindo o exercicio
        await app.db('excompfrase')
            .update(exercise)
            .where({cd_exercicio: exercise.cd_exercicio})
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))

        await app.db('prcompfrase')
            .where({cd_exercicio: exercise.cd_exercicio})
            .del()

        //Inserindo os parametros
        let idParams = 1
        for(let x in parameters){
            parameters[x].cd_parametro = idParams
            parameters[x].cd_exercicio = exercise.cd_exercicio
            idParams ++

            await app.db('prcompfrase')
                .insert(parameters[x])
        }
    }

    //Removendo exercicio
    const removeExercise = async (req,res) => {
        try {
            const rowsParamsDeleted = await app.db('prcompfrase')
                .where({cd_exercicio: req.params.id}).del()
                try {
                    existsOrError(rowsParamsDeleted, 'Parametros não encontrados')
                } catch (msg) {
                    res.status(400).send(msg)
                }

            const rowsExerciseDeleted = await app.db('excompfrase')
                .where({cd_exercicio: req.params.id}).del()
                try {
                    existsOrError(rowsExerciseDeleted, 'Exercicio não encontrado')
                } catch (msg) {
                    res.status(400).send(msg)
                }

            res.status(204).send()
        } catch (msg) {
            res.status(500).send(msg)
        }
    }

    //Pegando exercicio pelo id
    const getExercisesById = async (req, res) => {
        const id = req.params.id
        app.db('excompfrase')
            .where({cd_exercicio: id})
            .first()
            .then(exercises => res.json(exercises))
            .catch(err => res.status(500).send(err))
    }

    //Pegando parametros de um exercicio
    const getParamsExercise = async (req, res) => {
        const id = req.params.id
        app.db('prcompfrase')
            .where({cd_exercicio: id})
            .then(exercises => res.json(exercises))
            .catch(err => res.status(500).send(err))
    }

    return {insertExercise,updateExercise, removeExercise, getExercisesById, getParamsExercise}
}