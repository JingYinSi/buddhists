/**
 *  报数
 */
const entity = require('../biz/mygdh/Report'),
    mqPublish = require('@finelets/hyper-rest/mq')

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
    url: '/api/reports',
    rests: [{
        type: 'create',
        target: 'Report',
        handler: (req) => {
            return entity.create(req.body)
                .then(data => {
                    const publish = mqPublish['reportCreated']
                    return publish({
                        times: data.times,
                        user: data.user,
                        lessonIns: data.lessonIns,
                        id: data.id
                    })
                })
        }
    },
        {
            type: 'query',
            element: 'Report',
            handler: list
        }
    ]
}