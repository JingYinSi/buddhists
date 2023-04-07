/**
 *  报数排名
 */
const entity = require('../biz/mygdh/ReportRank')

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
    url: '/wx/api/lesson/instances/:id/reportsRank',
    transitions: {
        LessonInstance: {id: 'context.id'}
    },
    rests: [
        {
            type: 'query',
            element: 'Report',
            handler: list
        }
    ]
}