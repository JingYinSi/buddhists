/**
 * 当前课程实例
 */
const entity = require('../biz/mygdh/Lesson'),
    subDocPath = 'instances',
    logger = require('@finelets/hyper-rest/app/Logger')

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
        .then(list => {
            let promises = list.map(item => {
                return entity.listSubs(item.id, subDocPath).then(data => {
                    return data[0]
                })
            })
            return Promise.all(promises).then(values => {
                return {
                    items: values
                }
            })
        })
}

module.exports = {
    url: '/api/lesson/instances/current',
    transitions: {},
    rests: [
        {
            type: 'query',
            element: 'LessonInstance',
            handler: list
        }
    ]
}
