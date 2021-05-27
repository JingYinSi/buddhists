const entity = require('../biz').Apply

const list = function (query) {
    let condi
    try {
        condi = JSON.parse(query.q);
    } catch (e) {
        condi = {}
    }
    return entity.search(condi)
        .then(function (list) {
            return {
                items: list
            }
        })
};

module.exports = {
    url: '/livingforest/api/applies',
    rests: [{
            type: 'create',
            target: 'Apply',
            handler: (req) => {
                return entity.apply(req.body)
            }
        },
        {
            type: 'query',
            element: 'Apply',
            handler: list
        }
    ]
}