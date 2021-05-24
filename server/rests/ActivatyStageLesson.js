/**
 * Created by clx on 2017/10/13.
 */
const {
    ifMatch,
    ifNoneMatch,
    updateSubDoc,
    removeSubDoc,
    findSubDocById
} = require('../biz/Activaty');

const subDocPath = 'stages.lessons'

module.exports = {
    url: '/livingforest/api/activaty/stage/lessons/:id',
    rests: [{
            type: 'read',
            ifNoneMatch,
            handler: (id) => findSubDocById(id, subDocPath)
        },
        {
            type: 'update',
            ifMatch,
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