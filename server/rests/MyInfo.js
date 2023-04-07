/**
 * 我的功课薄
 */
const entity = require('../biz/mygdh/WxUser'),
    logger = require('@finelets/hyper-rest/app/Logger')

const findMyInfo = function (query, req) {
    // let openid = req.user.openid
    let openid = 'eeeeeeee'
    let condi = {'openid': openid}
    let text
    return entity.search(condi, text)
        .then(function (list) {
            let lessonInsCnt = list[0].lessonIns.length
            return {lessonInsCnt, ...list[0]}
        })
};


module.exports = {
    url: '/wx/api/myInfo',
    transitions: {},
    rests: [
        {
            type: 'read',
            element: 'MyInfo',
            handler: findMyInfo
        }
    ]
}
