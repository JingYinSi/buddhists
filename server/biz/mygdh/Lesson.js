const schema = require('../../../db/schema/mygdh/Lesson'),
    createEntity = require('@finelets/hyper-rest/db/mongoDb/DbEntity')

const config = {
    schema,
    projection: ['name', 'title', 'pic', 'desc'],
    updatables: ['name', 'title', 'pic', 'desc', 'instances'],
    searchables: ['name', 'desc'],
    listable: ['name']
}

const addIn = {}

module.exports = createEntity(config, addIn)