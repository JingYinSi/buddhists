/**
 * 更新我的回向文
 */
const logger = require('@finelets/hyper-rest/app/Logger'),
    users = require('../biz/mygdh/WxUser')

module.exports = {
    url: '/api/myInfos/:id/prayerText',
    rests: [{
        type: 'http',
        method: 'put',
        handler: (req, res) => {
            const id = req.params.id

            return users.updatePrayerText(id, req.body)
                .then(ok => {
                    const code = ok ? 204 : 404
                    return res.status(code).end()
                })
                .catch((err) => {
                    logger.error("Update user's prayerText error:\r\n" + JSON.stringify(err, null, 2))
                    return res.status(500).end()
                })
        }
    }
    ]
}
