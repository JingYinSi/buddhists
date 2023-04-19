/**
 *  意见反馈列表
 */
const entity = require('../biz/mygdh/Suggestion'),
    wxUserEntity = require("../biz/mygdh/WxUser");

const list = function (query) {
    let condi
    try {
        condi = JSON.parse(query.q);
    } catch (e) {
        condi = {}
    }
    let text
    return entity.search(condi, text)
        .then(function (list) {
            return {
                items: list
            }
        })
};

module.exports = {
    url: '/api/suggestions',
    rests: [{
        type: 'create',
        target: 'Suggestion',
        handler: (req) => {
            const data = req.body
            let openid
            if (process.env.RUNNING_MODE === 'rest') {
                openid = '0a1Pk00w3LJdq03U021w3UeRpW1Pk00n'
            } else {
                if (!req.user || !data) {
                    return res.status(403).end()
                }
                openid = req.user.openid
            }
            return wxUserEntity.search({'openid': openid})
                .then(function (list) {
                    data.user = list[0].id
                    return entity.create(req.body)
                })
        }
    },
        {
            type: 'query',
            element: 'Suggestion',
            handler: list
        }
    ]
}