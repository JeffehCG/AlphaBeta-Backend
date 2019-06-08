const fs = require('fs')
module.exports = app => {
    const {existsOrError, notExistsOrError, equalsOrError} = app.api.validation;

    //Inserindo parametro
    const insertParan = async (req , res) => {
        console.log('Entrou na inserção')
        const paran = {...req.fields}
        const file = {...req.files} 
        let fileUplod

        fileUplod = fs.readFileSync(file.ds_img.path)
        
        //Validando o parametro
            try {
                existsOrError(paran.cd_parametro, 'Codigo não informado')
                existsOrError(paran.nm_texto, 'Palavra não informada')
                existsOrError(file, 'Imagem não informada') 
            } catch (msg) {
                return res.status(400).send(msg);
            }

        //Pegando o codigo do ultimo exercicio cadastrado pelo professor
        if(paran.cd_professor){
            idLastExercise = await app.db('excompfrase')
                .where({cd_professor: paran.cd_professor})
                .max('cd_exercicio')
                .first()
            for (let y in idLastExercise){
                idLastExercise = idLastExercise[y]
            }
            paran.cd_exercicio = idLastExercise
        }
        else{
            paran.cd_exercicio = paran.cd_exercicio
        }

        delete paran.cd_professor
        //Inserindo o parametro
            
            paran.ds_img = fileUplod

            await app.db('prcompfrase')
                .insert(paran) 
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))

    }

    //Alterando pocisão do parametro
    const updatePosition = async (req, res) => {
        const paran = {...req.fields}
        const parametro = req.params.paran
        const exercicio = req.params.exercise

        await app.db('prcompfrase')
            .update(paran)
            .where({cd_parametro: parametro, cd_exercicio: exercicio})
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
    }

    //Alterando parametro
    const updateParan = async (req , res) => {
        const paran = {...req.fields}
        const file = {...req.files} 
        const cdParametro = req.params.paran
        const cdExercicio = req.params.exercise

        let fileUplod

        if(file.ds_img){
            fileUplod = fs.readFileSync(file.ds_img.path)
        }
        
        //Validando o parametro
            try {
                existsOrError(paran.cd_parametro, 'Codigo não informado')
                existsOrError(paran.nm_texto, 'Palavra não informada')
                existsOrError(file, 'Imagem não informada') 
            } catch (msg) {
                return res.status(400).send(msg);
            }

        //Alterando o parametro
        if(fileUplod){
            paran.ds_img = fileUplod
        }

            await app.db('prcompfrase')
                .update(paran)
                .where({cd_parametro: cdParametro, cd_exercicio: cdExercicio})
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))

    }

    return {insertParan,updateParan, updatePosition}

}