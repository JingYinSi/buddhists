const schema = require('../../../db/schema/mygdh/Lesson'),
    createEntity = require('@finelets/hyper-rest/db/mongoDb/DbEntity'),
    subDocPath = 'instances',
    {extend} = require('underscore')
const config = {
    schema,
    projection: ['name', 'title', 'pic', 'desc'],
    updatables: ['name', 'title', 'pic', 'desc', 'instances'],
    searchables: ['name', 'desc'],
    listable: ['name']
}

const entity = createEntity(config)
const obj = {
    updateLessonInstance: (msg) => {
        // return entity.findById("64266031ec16e55198335c8b").then(doc => {
        return entity.findSubDocById(msg.lessonIns, subDocPath).then(doc => {
            doc.toUpdate= {
                populations:doc.populations+1,
                todayPopulations:doc.todayPopulations+1,
                todayTimes:msg.times
            }
            return entity.updateSubDoc(subDocPath, {...doc})
        }).catch(e => {
            if (e.name === 'CastError') return false
            throw e
        })
    }
}

module.exports = extend(entity, obj)