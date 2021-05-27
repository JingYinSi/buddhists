/**
 * Created by clx on 2017/10/13.
 */
const {
    ifNoneMatch,
    findById
} = require('../biz').Apply;

module.exports = {
    url: '/livingforest/api/applies/:id',
    rests: [{
            type: 'read',
            ifNoneMatch,
            handler: findById
        }
    ]
}