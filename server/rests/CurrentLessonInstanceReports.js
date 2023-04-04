/**
 * 课程实例跑马灯
 */
const entity = require('../biz/mygdh/Report');
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
        User: 'context.user'
    },
    rests: [
        {
            type: 'create',
            target: 'Report',
            handler: (req) => {
                const data = req.body
                // if(!req.user || !data || !req.query.scope || req.user.id !== data.id) {
                //     return res.status(403).end()
                // }
                // req.id = req.user.id
                data.user = '642a389d2b15de4fe4c573ac'
                logger.error("mmmmmmmm:" + req.params['id'])
                data.lessonIns = req.params['id']
                data.reportDate = ''
                logger.error("xxxxxxxxx:" + data)
                logger.error("0000000000000:" + data.user)
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
