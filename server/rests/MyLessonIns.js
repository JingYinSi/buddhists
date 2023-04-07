/**
 * 课程实例
 */
const {
    ifNoneMatch,
    ifMatch,
    updateSubDoc,
    removeSubDoc,
    findSubDocById
} = require('../biz/mygdh/WxUser')
const subDocPath = 'lessonIns',
    logger = require('@finelets/hyper-rest/app/Logger')

module.exports = {
    url: '/wx/api/myLesson/inses/:id',
    transitions: {},
    rests: [{
        type: 'read',
        ifNoneMatch,
        handler: (id) => findSubDocById(id, subDocPath)
    },
        {
            type: 'update',
            // ifMatch,
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