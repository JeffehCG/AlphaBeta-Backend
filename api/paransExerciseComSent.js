const fs = require('fs')
module.exports = app => {
    const {existsOrError, notExistsOrError, equalsOrError} = app.api.validation;

    //Inserindo parametro
    const insertParan = async (req , res) => {
        const paran = {...req.fields}
        const file = {...req.files} 

        let fileUplod = fs.readFileSync(file.ds_img.path)

        //Validando o parametro
            try {
                existsOrError(paran.cd_parametro, 'Codigo não informado')
                existsOrError(paran.nm_texto, 'Palavra não informada')
                existsOrError(file, 'Imagem não informada') 
            } catch (msg) {
                return res.status(400).send(msg);
            }

        //Pegando o codigo do ultimo exercicio cadastrado pelo professor
        let idLastExercise = await app.db('excompfrase')
            .where({cd_professor: paran.cd_professor})
            .max('cd_exercicio')
            .first()
        for (let y in idLastExercise){
            idLastExercise = idLastExercise[y]
        }

        delete paran.cd_professor
        //Inserindo o parametro
            paran.cd_exercicio = idLastExercise
            paran.ds_img = fileUplod

            await app.db('prcompfrase')
                .insert(paran) 
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))

    }

    return {insertParan}

}