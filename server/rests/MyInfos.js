/**
 * 我的功课薄
 */
const entity = require('../biz/mygdh/WxUser'),
    logger = require('@finelets/hyper-rest/app/Logger')

const list = function (query, req) {
    let openid
    if (process.env.RUNNING_MODE === 'rest') {
        openid = '0a1Pk00w3LJdq03U021w3UeRpW1Pk00n'
    } else {
        openid = req.user.openid
    }

    let condi = {'openid': openid}
    let text
    return entity.search(condi, text)
        .then(function (list) {
            list.forEach(function (item){
                item.prayerText='谢谢打卡'
            })
            return {
                items: list
            }
        })
};


module.exports = {
    url: '/api/myInfos',
    transitions: {},
    rests: [
        {
            type: 'query',
            element: 'MyInfo',
            handler: list
        }
    ]
}
