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
        .then(function (list) {
            let promises = list.map(function (item) {
                return entity.listSubs(item.id, subDocPath).then(data => {
                    return data[0]
                })
            })
            return Promise.all(promises).then(function (values) {
                // print_array(values)
                return {
                    items: values
                }
            })
        })
}

//打印数组
function print_array(arr) {
    for (var key in arr) {
        if (typeof (arr[key]) == 'array' || typeof (arr[key]) == 'object') {//递归调用
            print_array(arr[key]);
        } else {
            logger.error("xxxxL:" + key + ' = ' + arr[key] + '<br>');
        }
    }
}

module.exports = {
    url: '/api/lesson/instances/current',
    transitions: {},
    rests: [
        // {
        //     type: 'create',
        //     target: 'LessonInstance',
        //     handler: (req) => {
        //         return entity.createSubDoc(req.params['id'], subDocPath, req.body)
        //     }
        // },
        {
            type: 'query',
            element: 'LessonInstance',
            handler: list
        }
    ]
}
