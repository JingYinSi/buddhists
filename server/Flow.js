module.exports = {
    Entry: {
        activaties: 'Activaties',
        lessons: 'Lessons',
        users: 'Users',
        register: 'RegisterUser',
        currentUser: 'CurrentUser'
    },
    Activaties: {
        add: 'Activaties',
        home: 'Entry'
    },
    Activaty: {
        self: "Activaty",
        collection: "Activaties",
        stages: "ActivatyStages"
    },
    ActivatyStages: {
        add: 'ActivatyStages',
        parent: 'Activaty'
    },
    ActivatyStage: {
        self: "ActivatyStage",
        collection: "ActivatyStages",
        stageLessons: "ActivatyStageLessons"
    },
    ActivatyStageLessons: {
        add: 'ActivatyStageLessons',
        parent: 'ActivatyStage'
    },
    ActivatyStageLesson: {
        self: "ActivatyStageLesson",
        collection: "ActivatyStageLessons",
        refLesson: "Lesson"
    },
    Lessons: {
        add: 'Lessons',
        home: 'Entry'
    },
    Lesson: {
        self: "Lesson",
        collection: "Lessons"
    },
    Users: {
        add: 'RegisterUser',
        home: 'Entry'
    },
    User: {
        password: 'Password',
        authorize: 'Authorization'
    }
}