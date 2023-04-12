const schema = require('../../../db/schema/mygdh/Report'),
    createEntity = require('@finelets/hyper-rest/db/mongoDb/DbEntity')

const config = {
    schema,
    projection: ['user', 'lessonIns', 'times', 'reportDate', 'createdAt'],
    updatables: ['user', 'lessonIns', 'times'],
    searchables: ['user', 'lessonIns', 'reportDate'],
    listable: ['user', 'lessonIns', 'times', 'reportDate', 'createdAt'],
    sort: {'times': -1},
    'queryListLinesLimit': 10
}

const addIn = {}

module.exports = createEntity(config, addIn)