/**
 * Created by clx on 2017/10/13.
 */
const {
    ifNoneMatch,
    updateSubDoc,
    removeSubDoc,
    findSubDocById,
    activateStage
} = require('../biz/Activaty'),
{isUndefined} = require('underscore')

const subDocPath = 'stages'

module.exports = {
    url: '/livingforest/api/activaty/stages/:id',
    transitions: {
        ActivatyStageLesson: {id: 'context.stages'}
    },
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
        },
        {
            type: 'http',
            method: 'post',
            handler: (req, res) => {
                const id = req.params.id
                let {activate, date} = req.body
                return activateStage(id, activate, date)
                    .then(data => {
                        if (isUndefined(data)) return res.sendStatus(404)
                        if (data) {
                            const url = req.originalUrl
                            res.location(url)
                            return res.status(200).json(data)
                        }
                        return res.sendStatus(403)
                    })
            }
        }
    ]
}