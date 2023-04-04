/**
 * Created by clx on 2017/10/13.
 */
const {
    ifMatch,
    ifNoneMatch,
    update,
    remove,
    findById
} = require('../biz/mygdh/WxUser');

module.exports = {
    url: '/wx/api/users/:id',
    transitions: {
        Report: {id: 'context.user'}
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
