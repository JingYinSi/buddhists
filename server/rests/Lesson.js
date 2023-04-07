/**
 *  课程
 */
const {
    ifMatch,
    ifNoneMatch,
    update,
    remove,
    findById
} = require('../biz/mygdh/Lesson')
const logger = require('@finelets/hyper-rest/app/Logger')

module.exports = {
    url: '/wx/api/lessons/:id',
    transitions: {
        LessonInstance: {id: 'context.Lesson'}
    },
    rests: [{
        type: 'read',
        ifNoneMatch,
        handler: findById
    },
        {
            type: 'update',
            ifMatch,
            handler: (id, data) => {
                data.id = id
                return update(data)
            }
        },
        {
            type: 'delete',
            handler: remove
        }
    ]
}