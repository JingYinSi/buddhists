const picGridFs = require('../biz').PicGridFs,
    entity = require('../biz/mygdh/Lesson'),
    mqPublish = require('@finelets/hyper-rest/mq')

module.exports = {
    url: '/api/lessons/:id/icon',
    rests: [{
            type: 'upload',
            target: 'Avatar',
            handler: (file, fileName, req) => {
                return picGridFs.upload(file, fileName)
                    .then(id => {
                        const publish = mqPublish['lessonIconChanged']
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
                return entity.updatePic(id)
                    .then(() => {
                        return true
                    })
            }
        }
    ]
}