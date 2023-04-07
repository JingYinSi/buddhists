const entity = require('../biz/mygdh/WxUser')

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
    url: '/wx/api/auth/users',
    transitions: {},
    rests: [{
        type: 'create',
        target: 'User',
        handler: (req) => {
            return entity.create(req.body)
        }
    },
        {
            type: 'query',
            element: 'User',
            handler: list
        }
    ]
}