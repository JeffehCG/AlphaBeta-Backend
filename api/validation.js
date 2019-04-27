module.exports = app => {

    //Verificar tentativas de passar valores nullos
    function existsOrError(value, msg){
        if(!value) throw msg
        if(Array.isArray(value) && value.length === 0) throw msg
        if(typeof value === 'string' && !value.trim()) throw msg
    }

    //Verifica se determinado dado ja existe
    function notExistsOrError(value, msg){
        try {
            existsOrError(value, msg)
        } catch (msg) {
            return
        }
        throw msg
    }

    //Verificando igualdade entre dois valores
    function equalsOrError(valueA, valueB, msg){
        if(valueA !== valueB) throw msg
    }

    return{existsOrError, notExistsOrError, equalsOrError}
}