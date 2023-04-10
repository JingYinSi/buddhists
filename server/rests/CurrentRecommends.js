/**
 *  推荐
 */
const entity = require('../biz/mygdh/Recommend')
const list = function () {
    return entity.search({enable: 1}, "")
        .then(function (list) {
            return {
                items: list
            }
        })
};

module.exports = {
    url: '/api/recommends/current', rests: [{
        type: 'query', element: 'Recommend', handler: list
    }]
}