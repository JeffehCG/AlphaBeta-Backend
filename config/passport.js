const {authSecret} = require('../.env')
const passport = require('passport')
const passportJwt = require('passport-jwt')
const {Strategy, ExtractJwt} = passportJwt

module.exports = app => {
    const params = {
        secretOrKey: authSecret,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    }

    const strategy = new Strategy(params, (payload, done) => {
        if(payload.teacher){
            app.db('professor')
            .where({cd_cpf: payload.cpf})
            .first()
            .then(user => done(null, user ? {...payload} : false ))
            .catch(user => done(null,false))
        }else{
            app.db('aluno')
            .where({cd_cpf: payload.cpf})
            .first()
            .then(user => done(null, user ? {...payload}: false))
            .catch(user => done(null,false))
        }
    })

    passport.use(strategy)

    return{
        authenticate: () => passport.authenticate('jwt', {session: false})
    }
}