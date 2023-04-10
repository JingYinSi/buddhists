/**
 *  课程
 */
const {
    ifMatch,
    update,
    remove,
    findById
} = require('../biz/mygdh/Calendar')
moment = require('moment')
const logger = require('@finelets/hyper-rest/app/Logger')
const entity = require("../biz/mygdh/Calendar");
const list = function (req,res) {
    let day =moment().format("yyyyMMDD")
    let condi = {"gongLiDay": day}
    let text
    return entity.search(condi, text)
        .then(function (list) {
            if(list.length>0){
                return res.status(200).json(list[0]);
            } else {
                return res.status(500);
            }
        })
};

module.exports = {
    url: '/api/calendar/current',
    rests: [{
        type: 'http',
        method:'get',
        handler: list
    }]
}