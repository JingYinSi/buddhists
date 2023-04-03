module.exports = {
    Entry: {
        users: 'Users',
        register: 'RegisterUser',
        lessons: 'Lessons',
        recommends: 'Recommends',
        reports: 'Reports',
        currentUser: 'CurrentUser',
        currentLessonInstances: 'CurrentLessonInstances'
    },
    Users: {
        add: 'RegisterUser',
        home: 'Entry'
    },
    User: {
        self: 'User',
        collection: 'Users'
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
        instance: "LessonInstance",
        lesson: "Lesson"
    },
    CurrentLessonInstances: {
        add: 'CurrentLessonInstances',
        home: 'Entry'
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