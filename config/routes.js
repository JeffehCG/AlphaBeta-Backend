const teacher = require('./authTeacher')

module.exports = app => {
    app.post('/signin', app.api.authentification.signin)
    app.post('/validateToken', app.api.authentification.validateToken)
    app.post('/students',app.api.student.insert)
    app.post('/teachers',app.api.teacher.insert)

    app.route('/students')
        .all(app.config.passport.authenticate())
        .get(teacher(app.api.student.get))
    
    app.route('/students/:cpf')
        .all(app.config.passport.authenticate())
        .put(app.api.student.update)
        .get(app.api.student.getById)

    app.route('/student/classroom/:cpf')
        .all(app.config.passport.authenticate())
        .get(app.api.student.getAllClassStudent)

    app.route('/student/exerciseComplete/:cpf')
        .all(app.config.passport.authenticate())
        .get(app.api.student.getAllExerciseStudent)
    
    app.route('/teachers')
        .all(app.config.passport.authenticate())
        .get(app.api.teacher.get)
    
    app.route('/teachers/:cpf')
        .all(app.config.passport.authenticate())
        .put(teacher(app.api.teacher.update))
        .get(app.api.teacher.getById)
    
    app.route('/teacher/classroom/:cpf')
        .all(app.config.passport.authenticate())
        .get(teacher(app.api.teacher.getAllClassTeacher))

    app.route('/teacher/exerciseComplete/:cpf')
        .all(app.config.passport.authenticate())
        .get(teacher(app.api.teacher.getExercisesByCpfTeacher))

    app.route('/classroom')
        .all(app.config.passport.authenticate())
        .post(teacher(app.api.classroom.insert))

    app.route('/classroom/:id')
        .all(app.config.passport.authenticate())
        .put(teacher(app.api.classroom.update))
        .delete(teacher(app.api.classroom.remove))
        .get(app.api.classroom.getById)

    app.route('/classroom/students/:id')
        .all(app.config.passport.authenticate())
        .get(app.api.classroom.getAllStudents)

    app.route('/classroom/exercises/:id')
        .all(app.config.passport.authenticate())
        .get(app.api.classroom.getAllExercises)

    app.route('/enrollment')
        .all(app.config.passport.authenticate())
        .post(teacher(app.api.studentEnrollment.insert))

    app.route('/enrollment/:cpf/:id')
        .all(app.config.passport.authenticate())
        .delete(teacher(app.api.studentEnrollment.remove))

    app.route('/exerciseComplete')
        .all(app.config.passport.authenticate())
        .post(teacher(app.api.exerciseCompleteSentence.insertExercise))

    app.route('/paransExercise')
        .all(app.config.passport.authenticate())
        .post(teacher(app.api.paransExerciseComSent.insertParan))
    
    app.route('/paransExercise/:paran/:exercise')
        .all(app.config.passport.authenticate())
        .put(teacher(app.api.paransExerciseComSent.updateParan))
    
    app.route('/positionExercise/:paran/:exercise')
        .all(app.config.passport.authenticate())
        .put(teacher(app.api.paransExerciseComSent.updatePosition))

    app.route('/exerciseComplete/:id')
        .all(app.config.passport.authenticate())
        .put(teacher(app.api.exerciseCompleteSentence.updateExercise))
        .delete(teacher(app.api.exerciseCompleteSentence.removeExercise))
        .get(app.api.exerciseCompleteSentence.getExercisesById)

    app.route('/exerciseComplete/params/:id')
        .all(app.config.passport.authenticate())
        .get(app.api.exerciseCompleteSentence.getParamsExercise)

    app.route('/exerciseComplete/paramsFirstImg/:id')
        .all(app.config.passport.authenticate())
        .get(app.api.exerciseCompleteSentence.getParamsExerciseFirst)

    app.route('/exerciseToClass')
        .all(app.config.passport.authenticate())
        .post(teacher(app.api.addExerciseToClass.insert))

    app.route('/exerciseToClass/:idExer/:idClass')
        .all(app.config.passport.authenticate())
        .delete(teacher(app.api.addExerciseToClass.remove))

    app.route('/exerciseFinished')
        .all(app.config.passport.authenticate())
        .post(app.api.exercisesFinished.insert)
    
    app.route('/exerciseFinished/:cpf/:cdExercicio')
        .all(app.config.passport.authenticate())
        .get(app.api.exercisesFinished.exerciceFinished)

    app.route('/searcheExerciceTeacher/:cpf')
        .all(app.config.passport.authenticate())
        .post(teacher(app.api.teacher.searchExercisesByCpfTeacher))

    app.route('/searcheExerciceStudent/:cpf')
        .all(app.config.passport.authenticate())
        .post(app.api.student.searchExerciseStudent)

    app.route('/searcheClassesTeacher/:cpf')
        .all(app.config.passport.authenticate())
        .post(teacher(app.api.teacher.searchClassTeacher))

    app.route('/searcheClassesStudent/:cpf')
        .all(app.config.passport.authenticate())
        .post(app.api.student.searchAllClassStudent)

    app.route('/searchStudents')
        .all(app.config.passport.authenticate())
        .post(teacher(app.api.student.searchStudents))
    
    app.route('/statsTeacher/:cpf')
        .all(app.config.passport.authenticate())
        .get(teacher(app.api.stats.getStatsTeacher))

    app.route('/statsStudent/:cpf')
        .all(app.config.passport.authenticate())
        .get(app.api.stats.getStatsStudent)
}
