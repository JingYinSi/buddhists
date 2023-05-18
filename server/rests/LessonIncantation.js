const picGridFs = require('../biz').PicGridFs,
    entity = require('../biz/mygdh/Lesson'),
    mqPublish = require('@finelets/hyper-rest/mq')

module.exports = {
    url: '/api/lessons/:id/incantation',
    rests: [{
            type: 'upload',
            target: 'Avatar',
            handler: (file, fileName, req) => {
                return picGridFs.upload(file, fileName)
                    .then(id => {
                        const publish = mqPublish['lessonIncantationChanged']
                        publish({
                            id: req.params.id,
                            icon: id
                        })
                        return {
                            id
                        }
                    })
            }
        },
        {
            type: 'delete',
            handler: (id) => {
                return entity.updateIncantation(id)
                    .then(() => {
                        return true
                    })
            }
        }
    ]
}