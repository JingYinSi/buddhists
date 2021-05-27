const entity = require('../biz/Activaty'),
{map} = require('underscore')

const list = function () {
    return entity.listCurrentStages()
        .then(list => {
            return {
                items: map(list, obj => {
                    return {id: obj.stage, activatyName: obj.activatyName, activaty: obj.activaty, stageName: obj.stageName}
                })
            }
        })
}

module.exports = {
    url: '/livingforest/api/current/stages',
    rests: [{
            type: 'query',
            element: 'ActivatyStage',
            handler: list
        }
    ]
}