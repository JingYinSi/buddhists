/**
 *  推荐
 */
const {
    ifMatch,
    ifNoneMatch,
    update,
    remove,
    findById
} = require('../biz/mygdh/Recommend');

module.exports = {
    url: '/wx/api/recommends/:id',
    transitions: {
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