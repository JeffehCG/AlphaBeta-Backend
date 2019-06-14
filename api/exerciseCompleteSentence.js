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

        delete exercise.parameters

        //Inserindo o exercicio
        await app.db('excompfrase')
            .insert(exercise)
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))

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
            
        } catch (msg) {
            return res.status(400).send(msg);
        }

        //Inserindo o exercicio
        await app.db('excompfrase')
            .update(exercise)
            .where({cd_exercicio: exercise.cd_exercicio})
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))

    }

    //Removendo exercicio
    const removeExercise = async (req,res) => {

        try {
            const exerciseIntoClass = await app.db('inclcompfrase')
                .where({cd_exercicio: req.params.id }).first()

            notExistsOrError(exerciseIntoClass, 'Exercicio vinculado a alguma turma')
        } catch (msg) {
            return res.status(400).send(msg);
        }

        await app.db('exercicioconcaluno')
            .where({cd_exercicio:req.params.id}).del()

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

    const convertImgToBinary = (parans) => {
        let paransImgBinary = parans.map(paran => {
            paran.ds_img = paran.ds_img.toString('base64')
            return paran
        })

        return paransImgBinary
    }

    //Pegando parametros de um exercicio
    const getParamsExercise = async (req, res) => {
        const id = req.params.id
        app.db('prcompfrase')
            .where({cd_exercicio: id})
            .then(exercises => res.json(convertImgToBinary(exercises)))
            .catch(err => res.status(500).send(err))
    }

    //Pegando a imagem do primeiro parametro
    const getParamsExerciseFirst = async (req, res) => {
        const id = req.params.id
        app.db('prcompfrase')
            .where({cd_exercicio: id})
            .first()
            .then(exercises => {
                let img = exercises.ds_img.toString('base64')
                res.json(img)
            })
            .catch(err => res.status(500).send(err))
    }

    return {insertExercise,updateExercise, removeExercise, getExercisesById, getParamsExercise,getParamsExerciseFirst}
}