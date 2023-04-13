/**
 * 课程实例
 */
const entity = require('../biz/mygdh/WxUser'),
    subDocPath = 'lessonIns',
    lessonEntity = require('../biz/mygdh/Lesson'),
    lessonSubDocPath = 'instances',
    lodash = require('lodash')

const list = function (query) {
    return entity.listSubs(query.id, subDocPath)
        .then(list => {
            let promises = list.map(item => {
                //查找功课获取课程id ，再查课程中的sortNo用于排序
                return lessonEntity.findSubDocById(item.lessonInsId, lessonSubDocPath).then(lessonIns => {
                    if (lessonIns) {
                        return lessonEntity.findById(lessonIns.lesson).then(lesson => {
                            return {'sortNo': lesson.sortNo, ...item}
                        })
                    }
                })
            })
            return Promise.all(promises).then(values => {
                let sortValues = lodash(values).sortBy(x => x.sortNo.toString());
                return {
                    items: sortValues
                }
            })
        })
}

module.exports = {
    url: '/api/myLesson/:id/inses',
    transitions: {},
    rests: [{
        type: 'create',
        target: 'MyLessonIns',
        handler: (req) => {
            return entity.createSubDoc(req.params['id'], subDocPath, req.body)
        }
    },
        {
            type: 'query',
            element: 'MyLessonIns',
            handler: list
        }
    ]
}
