const schema = require('../../../db/schema/mygdh/Recommend'),
    createEntity = require('@finelets/hyper-rest/db/mongoDb/DbEntity'),
    mqPublish = require('@finelets/hyper-rest/mq')

const config = {
    schema,
    projection: ['name', 'pic', 'link', 'desc', 'sortNo'],
    updatables: ['name', 'pic', 'link', 'desc', 'sortNo', 'enable'],
    searchables: ['name'],
    listable: ['name'],
    sort: {'sortNo': -1}
}

const addIn = {
    updatePic: (id, pic) => {
        let oldPic

        return schema.findById(id)
            .then(doc => {
                oldPic = doc.pic
                doc.pic = pic
                return doc.save()
            })
            .then(() => {
                if (oldPic) {
                    mqPublish['removePic'](oldPic)
                }
            })
    }
}

module.exports = createEntity(config, addIn)


