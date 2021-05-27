/**
 * Created by clx on 2017/10/13.
 */
const {
    ifMatch,
    ifNoneMatch,
    update,
    remove,
    findById
} = require('../biz/Activaty');

module.exports = {
    url: '/livingforest/api/activaties/:id',
    transitions: {
        ActivatyStageLesson: {id: 'context.Activaty'},
        ActivatyStage: {id: 'context.Activaty'}
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