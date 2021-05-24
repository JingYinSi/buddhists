const entity = require('../biz/Activaty')
const subDocPath = 'stages'

const list = function (query) {
    return entity.listSubs(query.id, subDocPath)
        .then(function (list) {
            return {
                items: list
            }
        })
}

module.exports = {
    url: '/livingforest/api/activaties/:id/stages',
    transitions: {
        ActivatyStage: {id: 'context.Activaty'}
    },
    rests: [{
            type: 'create',
            target: 'ActivatyStage',
            handler: (req) => {
                return entity.createSubDoc(req.params['id'], subDocPath, req.body)
            }
        },
        {
            type: 'query',
            element: 'ActivatyStage',
            handler: list
        }
    ]
}
