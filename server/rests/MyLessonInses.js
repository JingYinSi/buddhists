/**
 * 课程实例
 */
const entity = require('../biz/mygdh/WxUser'),
    subDocPath = 'lessonIns'

const list = function (query) {
    return entity.listSubs(query.id, subDocPath)
        .then(function (list) {
            return {
                items: list
            }
        })
}

module.exports = {
    url: '/api/myLesson/:id/inses',
    transitions: {},
    rests: [{
        type: 'create',
        target: 'MyLessonIns',
        handler: (req) => {
            return entity.createSubDoc(req.params['id'], subDocPath, req.body)
        }
    },
        {
            type: 'query',
            element: 'MyLessonIns',
            handler: list
        }
    ]
}
