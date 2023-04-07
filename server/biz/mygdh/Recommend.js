const schema = require('../../../db/schema/mygdh/Recommend'),
    createEntity = require('@finelets/hyper-rest/db/mongoDb/DbEntity')

const config = {
    schema,
    projection: ['name', 'pic', 'link', 'desc'],
    updatables: ['name', 'pic', 'link', 'desc', 'enable'],
    searchables: ['name'],
    listable: ['name']
}

const addIn = {}

module.exports = createEntity(config, addIn)