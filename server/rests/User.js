/**
 * Created by clx on 2017/10/13.
 */
const {
    ifMatch,
    ifNoneMatch,
    update,
    remove,
    findById
} = require('../biz').Employee;

module.exports = {
    url: '/livingforest/api/users/:id',
    transitions: {
        Purchase: {id: 'context'},
        Withdraw: {id: 'context'},
        PoTransaction: {id: 'context'}
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
