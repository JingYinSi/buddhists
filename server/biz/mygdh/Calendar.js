const schema = require('../../../db/schema/mygdh/Calendar'),
    createEntity = require('@finelets/hyper-rest/db/mongoDb/DbEntity'),
    {extend} = require('underscore')
const config = {
    schema,
    projection: ['gongLiDay', 'zangLiDay', 'specialDay'],
    updatables: ['gongLiDay', 'zangLiDay', 'specialDay'],
    searchables: ['gongLiDay', 'zangLiDay', 'specialDay'],
    listable: ['gongLiDay', 'zangLiDay', 'specialDay']
}

const entity = createEntity(config)
const obj = {
}

module.exports = extend(entity, obj)