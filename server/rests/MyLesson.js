/**
 * 我的功课薄
 */
const entity = require('../biz/mygdh/WxUser');
const logger = require('@finelets/hyper-rest/app/Logger')

const list = function (query, req) {
    // let openid = req.user.openid
    let openid = 'eeeeeeee'
    let condi = {"openid": openid}
    let text
    return entity.search(condi, text)
        .then(function (list) {
            return {
                items: list
            }
        })
};


module.exports = {
    url: '/wx/api/myLessons',
    transitions: {
    },
    rests: [
        {
            type: 'query',
            element: 'Report',
            handler: list
        }
    ]
}
