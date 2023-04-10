/**
 *  课程
 */
const entity = require("../biz/mygdh/Calendar"),
    moment = require('moment'),
    logger = require('@finelets/hyper-rest/app/Logger');
module.exports = {
    url: '/api/calendar/current',
    rests: [{
        type: 'http',
        method: 'get',
        handler: function (req, res) {
            let day = moment().format("yyyy-MM-DD")
            return entity.findByDay(day).then(function (data) {
                if (!data) {
                    logger.error("未找到指定的日期(" + day + ")的日历数据")
                    return res.status(500).end();
                } else {
                    return res.status(200).json(data);
                }
            })
        }
    }]
}