const schema = require('../../../db/schema/mygdh/Lesson'),
    createEntity = require('@finelets/hyper-rest/db/mongoDb/DbEntity'),
    subDocPath = 'instances',
    {extend} = require('underscore')
const config = {
    schema,
    projection: ['name', 'title', 'pic', 'desc'],
    updatables: ['name', 'title', 'pic', 'desc'],
    searchables: ['name', 'title', 'desc'],
    listable: ['name']
}

const entity = createEntity(config)
const obj = {
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
    },
    updateLessonInstance: (msg) => {
        return entity.findSubDocById(msg.lessonIns, subDocPath).then(doc => {
            if (doc && doc.target && doc.target >= 1 && msg.times >= 1) {
                let reportPopulations = Math.ceil(msg.times / doc.target)
                doc.toUpdate = {
                    populations: doc.populations + reportPopulations,
                    todayPopulations: doc.todayPopulations + reportPopulations,
                    todayTimes: doc.todayTimes + msg.times
                }
                return entity.updateSubDoc(subDocPath, doc)
            }
        }).catch(e => {
            if (e.name === 'CastError') return false
            throw e
        })
    }
}

module.exports = extend(entity, obj)