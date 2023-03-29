module.exports = {
    Entry: {
        users: 'Users',
        register: 'RegisterUser',
        currentUser: 'CurrentUser',
        lessons: 'Lessons',
        recommends: 'Recommends',
        reports: 'Reports'
    },
    Users: {
        add: 'RegisterUser',
        home: 'Entry'
    },
    User: {
        password: 'Password',
        authorize: 'Authorization'
    },
    Lessons: {
        add: 'Lessons',
        home: 'Entry'
    },
    Lesson: {
        self: "Lesson",
        collection: "Lessons",
        instances: "LessonInstances"
    },
    LessonInstances: {
        add: 'LessonInstances',
        parent: 'Lesson'
    },
    LessonInstance: {
        self: "LessonInstance",
        collection: "LessonInstances",
        refLesson: "Lesson"
    },
    Recommends: {
        add: 'Recommends',
        home: 'Entry'
    },
    Recommend: {
        self: "Recommend",
        collection: "Recommends"
    },
    Reports: {
        add: 'Reports',
        home: 'Entry'
    },
    Report: {
        self: "Report",
        collection: "Reports"
    }
}