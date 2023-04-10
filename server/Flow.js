module.exports = {
    Entry: {
        users: 'Users',
        calender: 'Calendar',
        register: 'RegisterUser',
        lessons: 'Lessons',
        recommends: 'Recommends',
        reports: 'Reports',
        currentLessonInstances: 'CurrentLessonInstances',
        myInfos: 'MyInfos'
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
        self: 'Lesson',
        collection: 'Lessons',
        instances: 'LessonInstances'
    },
    LessonInstances: {
        add: 'LessonInstances',
        parent: 'Lesson'
    },
    LessonInstance: {
        self: 'LessonInstance',
        collection: 'LessonInstances',
        instance: 'LessonInstance',
        lesson: 'Lesson',
        report: 'CurrentLessonInstanceReports',
        reports: 'CurrentLessonInstanceReports',
        reportsRank: 'ReportsRank'
    },
    CurrentLessonInstanceReports: {
        self: 'CurrentLessonInstanceReports',
        collection: 'CurrentLessonInstanceReports'
    },
    CurrentLessonInstances: {
        self: 'CurrentLessonInstances',
        home: 'Entry'
    },
    ReportsRank: {
        self: 'ReportsRank',
        home: 'Entry'
    },
    Recommends: {
        add: 'Recommends',
        home: 'Entry'
    },
    Recommend: {
        self: 'Recommend',
        collection: 'Recommends'
    },
    Reports: {
        add: 'Reports',
        home: 'Entry'
    },
    Report: {
        self: 'Report',
        user: 'User',
        collection: 'Reports'
    },
    MyInfos: {
        home: 'Entry'
    },
    MyInfo: {
        self: 'MyInfo',
        lessonIns: 'MyLessonInses',
        collection: 'MyInfos'
    },
    MyLessonInses: {
        add: 'MyLessonInses',
        parent: 'MyInfo'
    },
    MyLessonIns: {
        self: 'MyLessonIns',
        collection: 'MyLessonInses',
        lessonInstance: 'LessonInstance',
        myReports: 'MyLessonInsReports',
        myInfo: 'MyInfo'
    },
    MyLessonInsReports: {
        self: 'MyLessonInsReports',
        parent: 'MyLessonIns'
    }
}