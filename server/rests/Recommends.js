/**
 *  推荐
 */
const entity = require('../biz/mygdh/Recommend')

const list = function (query) {
    let condi
    try {
        condi = JSON.parse(query.q);
    } catch (e) {
        condi = {}
    }
    let text = query.s ? query.s : '.'
    text = text.length > 0 ? text : '.'
    return entity.search(condi, text)
        .then(function (list) {
            return {
                items: list
            }
        })
};

module.exports = {
    url: '/wx/api/recommends',
    rests: [{
            type: 'create',
            target: 'Recommend',
            handler: (req) => {
                return entity.create(req.body)
            }
        },
        {
            type: 'query',
            element: 'Recommend',
            handler: list
        }
    ]
}