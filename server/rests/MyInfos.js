/**
 * 我的功课薄
 */
const entity = require('../biz/mygdh/WxUser'),
    logger = require('@finelets/hyper-rest/app/Logger')

const list = function (query, req) {
    let openid
    if (process.env.RUNNING_MODE === 'rest') {
        openid = 'eeeeeeee'
    } else {
        openid = req.user.openid
    }

    let condi = {'openid': openid}
    let text
    return entity.search(condi, text)
        .then(function (list) {
            return {
                items: list
            }
        })
};


module.exports = {
    url: '/wx/api/myInfos',
    transitions: {},
    rests: [
        {
            type: 'query',
            element: 'MyInfo',
            handler: list
        }
    ]
}
