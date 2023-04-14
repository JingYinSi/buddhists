const schema = require('../../../db/schema/mygdh/Lesson'),
    createEntity = require('@finelets/hyper-rest/db/mongoDb/DbEntity'),
    subDocPath = 'instances',
    {extend} = require('underscore')
const config = {
    schema,
    projection: ['name', 'title', 'pic', 'sortNo', 'desc'],
    updatables: ['name', 'title', 'pic', 'sortNo', 'desc'],
    searchables: ['name', 'title', 'desc'],
    listable: ['name'],
    sort: {'sortNo': 1}
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
            if (doc && msg.times >= 1) {
                let reportPopulations = 1
                if (doc.target && doc.target >= 1) {
                    reportPopulations = Math.ceil(msg.times / doc.target)
                }
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
    },
    resetLessonIns: (jobParam) => {
        return schema.find().then((list) => {
            list.forEach(item => {
                return entity.listSubs(item.id, subDocPath).then(lessonIns => {
                    lessonIns.map(lessonInsItem => {
                        if (lessonInsItem && lessonInsItem.todayPopulations >= 1) {
                            lessonInsItem.toUpdate = {
                                todayPopulations: 0,
                                todayTimes: 0
                            }
                            return entity.updateSubDoc(subDocPath, lessonInsItem)
                        }
                    })
                })
            })
        })
            .catch(e => {
                if (e.name === 'CastError') return false
                throw e
            })
    }
}

module.exports = extend(entity, obj)