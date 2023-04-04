/**
 * 课程实例跑马灯
 */
const entity = require('../biz/mygdh/Report');
const WxUserEntity = require('../biz/mygdh/WxUser');
const logger = require('@finelets/hyper-rest/app/Logger')

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
    transitions: {
    },
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
                // let text
                // WxUserEntity.search({"openid": "eeeeeee"})

                data.user = '642a389d2b15de4fe4c573ac'
                data.lessonIns = req.params['id']
                data.reportDate = ''
                return entity.create(req.body)
            }
        },
        {
            type: 'query',
            element: 'Report',
            handler: id => list(id)
        }
    ]
}
