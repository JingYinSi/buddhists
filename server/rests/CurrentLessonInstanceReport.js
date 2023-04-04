/**
 * 课程实例当前用户报数
 */
const entity = require('../biz/mygdh/Report');
const {
    ifMatch,
    ifNoneMatch,
    update,
    remove,
    findById
} = require('../biz/mygdh/Report');
const logger = require('@finelets/hyper-rest/app/Logger')

module.exports = {
    url: '/wx/api/lesson/instances/current/:id/report',
    transitions: {
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
        }
    ]
}
