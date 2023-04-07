/**
 * 课程实例跑马灯
 */
const entity = require('../biz/mygdh/Report'),
    WxUserEntity = require('../biz/mygdh/WxUser'),
    logger = require('@finelets/hyper-rest/app/Logger'),
    mqPublish = require('@finelets/hyper-rest/mq')

const list = function (query) {
    let condi = {"lessonIns": query.id}
    let text
    return entity.search(condi, text)
        .then(function (list) {
            return {
                items: list
            }
        })
};


module.exports = {
    url: '/wx/api/lesson/instances/current/:id/reports',
    transitions: {},
    rests: [
        {
            type: 'create',
            target: 'Report',
            handler: (req) => {
                const data = req.body
                // if (!req.user || !data) {
                //     return res.status(403).end()
                // }
                // let openid = req.user.openid

                // return WxUserEntity.search({"openid": "7777777"})
                //     .then(function (list) {
                //         data.user = list[0].id
                //         data.lessonIns = req.params['id']
                //         data.reportDate = ''
                //         return entity.create(req.body)
                //     })

                data.user = '642a389d2b15de4fe4c573ac'
                data.lessonIns = req.params['id']
                data.reportDate = ''
                return entity.create(req.body)
                    .then(data => {
                        const publish = mqPublish['reportCreated']
                        return publish({
                            times: data.times,
                            user: data.user,
                            lessonIns: data.lessonIns,
                            id: data.id
                        })

                    })
            }
        },
        {
            type: 'query',
            element: 'Report',
            handler: id => list(id)
        }
    ]
}
