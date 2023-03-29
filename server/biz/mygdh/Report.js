const schema = require('../../../db/schema/mygdh/Report'),
    createEntity = require('@finelets/hyper-rest/db/mongoDb/DbEntity')

const config = {
    schema,
    projection: ['user'],
    updatables: ['user', 'lessonIns', 'times', 'reportDate'],
    searchables: ['user'],
    listable: ['user']
}

const addIn = {}

module.exports = createEntity(config, addIn)