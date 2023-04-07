const Employee = require('./bas/Employee'),
    Lesson = require('./mygdh/Lesson'),
    PicGridFs = require('@finelets/hyper-rest/db/mongoDb/GridFs')({bucketName: 'pic'}),
    mqPublish = require('@finelets/hyper-rest/mq')

module.exports = {
    Employee, Lesson, PicGridFs
}