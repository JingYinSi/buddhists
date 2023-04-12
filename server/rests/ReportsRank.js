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
    //默认查询当天
    if (!condi.reportDate) {
        let reportDate = new Date().toLocaleDateString('zh').replaceAll('/', '')
        condi.reportDate = reportDate
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
    url: '/api/lesson/instances/:id/reportsRank',
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