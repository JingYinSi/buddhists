const entity = require('../biz').Employee;

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
    url: '/livingforest/api/auth/users',
    rests: [
        {
            type: 'query',
            element: 'User',
            handler: list
        }
    ]
}