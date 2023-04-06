const schema = require('../../../db/schema/mygdh/Report'),
    createEntity = require('@finelets/hyper-rest/db/mongoDb/DbEntity')

const config = {
    schema,
    projection: ['user', 'lessonIns', 'times', 'createdAt'],
    updatables: ['user', 'lessonIns', 'times', 'createdAt',],
    searchables: ['user', 'lessonIns', 'createdAt'],
    listable: ['user','lessonIns', 'times', 'createdAt']
}

const addIn = {}

module.exports = createEntity(config, addIn)