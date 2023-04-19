/**
 *  意见反馈列表
 */
const {
    ifNoneMatch,
    remove,
    findById
} = require('../biz/mygdh/Suggestion')

module.exports = {
    url: '/api/suggestions/:id',
    transitions: {
    },
    rests: [{
        type: 'read',
        ifNoneMatch,
        handler: findById
    },
        {
            type: 'delete',
            handler: remove
        }
    ]
}