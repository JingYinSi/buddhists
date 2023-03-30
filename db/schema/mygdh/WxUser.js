const mongoose = require('mongoose'),
    createCollection = require('@finelets/hyper-rest/db/mongoDb/CreateCollection'),
    createSchema = require('@finelets/hyper-rest/db/mongoDb/CreateSchema'),
    ObjectId = mongoose.Schema.Types.ObjectId;

const statisticSchema = createSchema({
    dayLessonInsNumber: {type: Number, default: 0},
    lessonDays: {type: Number, default: 0}
})

const lessonInSchema = createSchema({
    lessonInsId: {type: ObjectId, required: true},
    days: {type: Number, default: 0},
    dayTimes: {type: Number, default: 0},
    weekTimes: {type: Number, default: 0},
    monthTimes: {type: Number, default: 0},
    totalTimes: {type: Number, default: 0}
})

const dbModel = createCollection({
    name: 'WxUser',
    schema: {
        userId: {type: String},
        name: {type: String, required: true},
        openid: String,
        prov: {type: String},
        city: {type: String},
        pic: String,
        prayerText: String,
        unionId: String,
        statistics: [statisticSchema],
        lessonIns: [lessonInSchema]
    },
    indexes: [
        {
            index: {userId: 1, openid: 1},
            options: {unique: true}
        }
    ]
})

module.exports = dbModel