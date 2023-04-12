/**
 * 课程实例跑马灯 及 当前功课用户报数
 */
const entity = require('../biz/mygdh/Report'),
    wxUserEntity = require('../biz/mygdh/WxUser'),
    logger = require('@finelets/hyper-rest/app/Logger'),
    mqPublish = require('@finelets/hyper-rest/mq'),
    moment = require('moment')

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
    url: '/api/lesson/instances/current/:id/reports',
    transitions: {},
    rests: [
        {
            type: 'create',
            target: 'Report',
            handler: (req, res) => {
                const data = req.body
                let openid
                if (process.env.RUNNING_MODE === 'rest') {
                    openid = '0a1Pk00w3LJdq03U021w3UeRpW1Pk00n'
                } else {
                    if (!req.user || !data) {
                        return res.status(403).end()
                    }
                    openid = req.user.openid
                }
                return wxUserEntity.search({'openid': openid})
                    .then(function (list) {
                        data.user = list[0].id
                        data.lessonIns = req.params['id']
                        data.reportDate = moment().format('yyyyMMDD')
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
