const schema = require('../../../db/schema/mygdh/Report'),
    createEntity = require('@finelets/hyper-rest/db/mongoDb/DbEntity'),
    moment = require("moment/moment"),
    {promise} = require("sinon"),
    _ = require("lodash"),
    {extend} = require("underscore");

const config = {
    schema,
    projection: ['user', 'lessonIns', 'times', 'reportDate', 'createdAt'],
    updatables: ['user', 'lessonIns', 'times'],
    searchables: ['user', 'lessonIns', 'reportDate'],
    listable: ['user', 'lessonIns', 'times', 'reportDate', 'createdAt']
}

const entity = createEntity(config)

const addIn = {
    todayUserLessonReportCount: (userId, lessonInsId) => {
        let reportDate = moment().format('yyyyMMDD')
        let condi = {'user': userId, 'reportDate': reportDate, 'lessonIns': lessonInsId}
        let text
        return entity.search(condi, text)
            .then(function (list) {
                const promise = new Promise((resolve, reject) => {
                    resolve(list.length)
                });
                return promise;
            })
    }
}

module.exports = extend(entity, addIn)