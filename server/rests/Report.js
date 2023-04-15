/**
 *  报数
 */
const {
    ifMatch,
    ifNoneMatch,
    update,
    remove,
    findById
} = require('../biz/mygdh/Report')
const moment = require('moment')


module.exports = {
    url: '/api/reports/:id',
    transitions: {
        User: {id: 'context.user'}
    },
    rests: [{
            type: 'read',
            ifNoneMatch,
            handler: (id, projection) => {
                return findById(id, projection).then(doc=> {
                    let formatDay = moment(doc.createdAt).format('yyyy-MM-DD HH:mm')
                    return {...doc, createdAt: formatDay}
                })
            }
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