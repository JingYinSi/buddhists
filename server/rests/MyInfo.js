/**
 * 我的功课薄
 */
const {
    ifMatch,
    ifNoneMatch,
    update,
    remove,
    findById
} = require('../biz/mygdh/WxUser')

module.exports = {
    url: '/api/myInfos/:id',
    transitions: {
        MyLessonIns: {id: 'context.WxUser'}
    },
    rests: [{
            type: 'read',
            ifNoneMatch,
            handler: (id) => {
                return findById(id).then(doc => {
                    let lessonInsCnt = doc.lessonIns.length
                    return {lessonInsCnt, ...doc}
                })
            }
        },
        {
            type: 'update',
            ifMatch,
            handler: (id, data) => {
                data.id = id
                return update(data)
            }
        }
    ]
}