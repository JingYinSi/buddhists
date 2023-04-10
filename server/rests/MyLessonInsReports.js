/**
 *  我的功课报数
 */
const entity = require('../biz/mygdh/Report')

const list = function (query) {
    let openid
    if (process.env.RUNNING_MODE === 'rest') {
        openid = '0a1Pk00w3LJdq03U021w3UeRpW1Pk00n'
    } else {
        openid = query.user.openid
    }
    let condi = {'lessonIns': query.id, user: openid}
    let text
    return entity.search(condi, text)
        .then(function (list) {
            return {
                items: list
            }
        })
};

module.exports = {
    url: '/api/myLesson/inses/:id/reports',
    rests: [
        {
            type: 'query',
            element: 'Report',
            handler: list
        }
    ]
}