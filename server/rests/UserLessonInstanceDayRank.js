/**
 *  报数排名
 */
const entity = require('../biz/mygdh/UserLessonInstance')
const dayTimesRankList = function (id) {
    return entity.dayTimesRankList(id)
        .then(function (list) {
            return {
                items: list
            }
        })
};

module.exports = {
    url: '/api/lesson/instances/:id/rank/dayTimes',
    transitions: {
    },
    rests: [
        {
            type: 'read',
            handler: dayTimesRankList
        }
    ]
}