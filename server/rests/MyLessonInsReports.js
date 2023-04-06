/**
 *  我的功课报数
 */
const entity = require('../biz/mygdh/Report');

const list = function (query) {
    // let openid = req.user.openid
    let openid = '642a389d2b15de4fe4c573ac'
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
    url: '/wx/api/myLesson/inses/:id/reports',
    rests: [
        {
            type: 'query',
            element: 'Report',
            handler: list
        }
    ]
}