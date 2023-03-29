/**
 * 课程实例
 */
const entity = require('../biz/mygdh/Lesson')
const subDocPath = 'instances'

const list = function (query) {
    return entity.listSubs(query.id, subDocPath)
        .then(function (list) {
            return {
                items: list
            }
        })
}

module.exports = {
    url: '/livingforest/api/lesson/:id/instances',
    transitions: {
        // LessonInstance: {id: 'context.Lesson'}
    },
    rests: [{
            type: 'create',
            target: 'LessonInstance',
            handler: (req) => {
                return entity.createSubDoc(req.params['id'], subDocPath, req.body)
            }
        },
        {
            type: 'query',
            element: 'LessonInstance',
            handler: list
        }
    ]
}
