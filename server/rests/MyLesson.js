/**
 * 我的功课薄
 */
const entity = require('../biz/mygdh/WxUser');
const logger = require('@finelets/hyper-rest/app/Logger')

const findMyLesson = function (query, req) {
    // let openid = req.user.openid
    let openid = 'eeeeeeee'
    let condi = {"openid": openid}
    let text
    return entity.search(condi, text)
        .then(function (list) {
            return list[0]
        })
};


module.exports = {
    url: '/wx/api/myLesson',
    transitions: {
    },
    rests: [
        {
            type: 'read',
            element: 'MyLesson',
            handler: findMyLesson
        }
    ]
}
