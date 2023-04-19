const schema = require('../../../db/schema/mygdh/Suggestion'),
    createEntity = require('@finelets/hyper-rest/db/mongoDb/DbEntity')

const config = {
    schema,
    projection: ['user', 'text', 'createdAt'],
    updatables: ['text'],
    searchables: ['user', 'text', 'createdAt'],
    listable: ['user', 'text', 'createdAt']
}

const addIn = {}

module.exports = createEntity(config, addIn)