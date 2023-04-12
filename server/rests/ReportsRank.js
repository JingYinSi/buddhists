/**
 *  报数排名
 */
const entity = require('../biz/mygdh/ReportRank'),
    moment = require('moment')

const list = function (query) {
    let condi
    try {
        condi = JSON.parse(query.q);
    } catch (e) {
        condi = {}
    }
    //默认查询当天
    if (!condi.reportDate) {
        condi.reportDate =  moment().format('yyyyMMDD')
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