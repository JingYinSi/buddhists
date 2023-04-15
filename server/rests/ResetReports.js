/**
 * 重置报数统计
 */
const wxUserEntity = require('../biz/mygdh/WxUser'),
    lessonEntity = require('../biz/mygdh/Lesson'),
    logger = require('@finelets/hyper-rest/app/Logger')

module.exports = {
    url: '/job/reset/reports',
    transitions: {},
    rests: [{
        type: 'http',
        method: 'put',
        handler: (req, res) => {

            lessonEntity.resetLessonIns(req.body)

            wxUserEntity.resetUserLesson(req.body)

            return wxUserEntity.resetUserLessonIns(req.body)
                .then(ok => {
                    return res.status(200).end()
                })
                .catch((err) => {
                    return res.status(500).end()
                })
        }
    }
    ]
}
