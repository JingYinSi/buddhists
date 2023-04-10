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
    findByDay: function (day) {
        let condi = {"gongLiDay": day}
        let text
        return entity.search(condi, text)
            .then(function (list) {
                if (list.length > 0) {
                    return list[0];
                } else {
                    return undefined;
                }
            })
    }
}

module.exports = extend(entity, obj)