/**
 * 课程实例
 */
const {
    ifNoneMatch,
    updateSubDoc,
    removeSubDoc,
    findSubDocById
} = require('../biz/mygdh/Lesson')

const subDocPath = 'instances'

module.exports = {
    url: '/wx/api/lesson/instances/:id',
    transitions: {
        // LessonInstance: {id: 'context.Lesson'},
        // Lesson: {id: 'context.Lesson'}
    },
    rests: [{
        type: 'read',
        ifNoneMatch,
        handler: (id) => findSubDocById(id, subDocPath)
    },
        {
            type: 'update',
            conditional: false,
            handler: (id, data) => {
                data.id = id
                return updateSubDoc(subDocPath, data)
            }
        },
        {
            type: 'delete',
            handler: (id) => removeSubDoc(id, subDocPath)
        }
    ]
}