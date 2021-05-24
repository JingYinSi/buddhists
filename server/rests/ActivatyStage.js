/**
 * Created by clx on 2017/10/13.
 */
const {
    ifNoneMatch,
    updateSubDoc,
    removeSubDoc,
    findSubDocById
} = require('../biz/Activaty');

const subDocPath = 'stages'

module.exports = {
    url: '/livingforest/api/activaty/stages/:id',
    rests: [{
            type: 'read',
            ifNoneMatch,
            handler: (id) => findSubDocById(id, subDocPath)
        },
        {
            type: 'update',
            conditional: false,
            handler: (id, data) => {
                data.id = id
                return updateSubDoc(subDocPath, data)
            }
        },
        {
            type: 'delete',
            handler: (id) => removeSubDoc(id, subDocPath)
        }
    ]
}