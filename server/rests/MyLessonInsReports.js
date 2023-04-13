/**
 *  我的功课报数
 */
const entity = require('../biz/mygdh/Report'),
    wxUserEntity = require('../biz/mygdh/WxUser'),
    moment = require('moment')

const list = function (query, req) {
    let openid
    if (process.env.RUNNING_MODE === 'rest') {
        openid = '0a1Pk00w3LJdq03U021w3UeRpW1Pk00n'
    } else {
        openid = req.user.openid
    }

    return wxUserEntity.search({'openid': openid})
        .then(list => {
            let user = list[0].id
            let condi = {'lessonIns': query.id, 'user': user}
            let text
            return entity.search(condi, text)
                .then(function (list) {
                    if (list) {
                        let newList = list.map(item => {
                            let formatDay = moment(item.createdAt).format('yyyy-MM-DD HH:mm')
                            return {
                                ...item,
                                createdAt: formatDay
                            }
                        })
                        return {
                            items: newList
                        }
                    }
                })
        })
};

module.exports = {
    url: '/api/myLesson/inses/:id/reports',
    transitions: {
        MyLessonIns: {id: 'context.lessonInsId'}
    },
    rests: [
        {
            type: 'query',
            element: 'Report',
            handler: list
        }
    ]
}