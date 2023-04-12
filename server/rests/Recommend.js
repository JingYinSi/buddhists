/**
 *  推荐
 */
const {
    ifMatch,
    ifNoneMatch,
    update,
    remove,
    findById
} = require('../biz/mygdh/Recommend')

module.exports = {
    url: '/api/recommends/:id',
    transitions: {
    },
    rests: [{
            type: 'read',
            ifNoneMatch,
            dataRef: {Avatar: 'pic'},
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