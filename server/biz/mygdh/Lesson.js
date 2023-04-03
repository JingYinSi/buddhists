const schema = require('../../../db/schema/mygdh/Lesson'),
    createEntity = require('@finelets/hyper-rest/db/mongoDb/DbEntity')

const config = {
    schema,
    projection: ['name', 'desc'],
    updatables: ['name', 'title', 'desc','instances'],
    searchables: ['name', 'desc'],
    listable: ['name']
}

const addIn = {}

module.exports = createEntity(config, addIn)