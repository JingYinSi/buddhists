/**
 * 课程实例跑马灯
 */
const entity = require('../biz/mygdh/Report');
const logger = require('@finelets/hyper-rest/app/Logger')

const list = function (query) {
    let condi = {"lessonIns": query.id}
    let text
    return entity.search(condi, text)
        .then(function (list) {
            return {
                items: list
            }
        })
};

module.exports = {
    url: '/wx/api/lesson/instances/current/:id/reports',
    transitions: {},
    rests: [
        {
            type: 'query',
            element: 'Report',
            handler: id => list(id)
        }
    ]
}
