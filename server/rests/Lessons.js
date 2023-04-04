/**
 *  课程
 */
const entity = require('../biz/mygdh/Lesson');

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
    url: '/wx/api/lessons',
    transitions: {
        // LessonInstance: {id: 'context.Lesson'}
    },
    rests: [{
        type: 'create',
        target: 'Lesson',
        handler: (req) => {
            return entity.create(req.body)
        }
    },
        {
            type: 'query',
            element: 'Lesson',
            handler: list
        }
    ]
}