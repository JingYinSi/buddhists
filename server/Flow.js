module.exports = {
    Entry: {
        activaties: 'Activaties',
        lessons: 'Lessons',
        applies: 'Applies',
        currentActivatyStages: 'CurrentActivatyStages',
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
        start: "ActivatyStage",
        collection: "ActivatyStages",
        stageLessons: "ActivatyStageLessons",
        activaty: "Activaty"
    },
    ActivatyStageLessons: {
        add: 'ActivatyStageLessons',
        parent: 'ActivatyStage'
    },
    ActivatyStageLesson: {
        self: "ActivatyStageLesson",
        collection: "ActivatyStageLessons",
        refLesson: "Lesson",
        stage: "ActivatyStage",
        activaty: "Activaty"
    },
    Lessons: {
        add: 'Lessons',
        home: 'Entry'
    },
    Lesson: {
        self: "Lesson",
        collection: "Lessons"
    },
    Applies: {
        add: 'Applies',
        home: 'Entry'
    },
    Apply: {
        self: "Apply",
        collection: "Applies"
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