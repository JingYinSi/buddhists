/**
 *  推荐图片
 */
const {PicGridFs: picGridFs} = require("../biz");
const mqPublish = require("../../../hyper-rest/mq");
const entity = require("../biz/mygdh/Recommend");

module.exports = {
    url: '/api/recommends/:id/pic',
    transitions: {
        Recommend: {id: 'context'}
    },
    rests: [{
        type: 'upload',
        target: 'Avatar',
        handler: (file, fileName, req) => {
            return picGridFs.upload(file, fileName)
                .then(id => {
                    const publish = mqPublish['recommendPicChanged']
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