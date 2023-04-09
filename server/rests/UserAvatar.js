const picGridFs = require('../biz').PicGridFs,
    entity = require('../biz/mygdh/WxUser'),
    mqPublish = require('@finelets/hyper-rest/mq')

module.exports = {
    url: '/api/users/:id/pic',
    rests: [{
            type: 'upload',
            target: 'Avatar',
            handler: (file, fileName, req) => {
                return picGridFs.upload(file, fileName)
                    .then(id => {
                        const publish = mqPublish['employeePicChanged']
                        publish({
                            id: req.params.id,
                            pic: id
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