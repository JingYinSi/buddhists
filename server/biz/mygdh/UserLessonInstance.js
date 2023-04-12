const schema = require('../../../db/schema/mygdh/WxUser');
const mongoose = require("mongoose");
    createEntity = require('@finelets/hyper-rest/db/mongoDb/DbEntity')

const config = {
    schema,
    projection: [
        'userId',
        'lessonIns'
    ],
    updatables: ['lessonIns'],
    searchables: ['userId','lessonIns'],
    listable: ['lessonIns']
}

const addIn = {
    dayTimesRankList: function(lessonInsId){
        return schema.find({
            "lessonIns.lessonInsId": lessonInsId
        },
        {
            id:true,
            userId:true,
            'lessonIns.dayTimes':true
        }).sort({ dayTimes: -1 })
    }
}

module.exports = createEntity(config, addIn)