const entity = require('../biz/Activaty')
const subDocPath = 'stages.lessons'

const list = function (query) {
    return entity.listSubs(query.id, subDocPath)
        .then(function (list) {
            return {
                items: list
            }
        })
}

module.exports = {
    url: '/livingforest/api/activaty/stages/:id/lessons',
    transitions: {
        ActivatyStageLesson: {id: 'context.stages'}
    },
    rests: [{
            type: 'create',
            target: 'ActivatyStageLesson',
            handler: (req) => {
                return entity.createSubDoc(req.params['id'], subDocPath, req.body)
            }
        },
        {
            type: 'query',
            element: 'ActivatyStageLesson',
            handler: list
        }
    ]
}
