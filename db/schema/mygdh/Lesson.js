const mongoose = require('mongoose'),
    createCollection = require('@finelets/hyper-rest/db/mongoDb/CreateCollection'),
    createSchema = require('@finelets/hyper-rest/db/mongoDb/CreateSchema'),
    ObjectId = mongoose.Schema.Types.ObjectId;

const instanceSchema = createSchema({
    lesson: {type: ObjectId, required: true},
    start: Date,
    end: Date,
    target: {type: Number, default: 0},
    totalTarget: {type: Number, default: 0},
    populations: {type: Number, default: 0},
    todayPopulations: {type: Number, default: 0},
    todayTimes: {type: Number, default: 0}
})

const dbModel = createCollection({
    name: 'Lesson',
    schema: {
        name: {type: String, required: true},
        title: {type: String, required: true},
        icon: {type: String, required: true},
        pic: {type: String, required: true},
        desc: String,
        sortNo:{type:Number,default:0},
        instances: [instanceSchema]
    },
    indexes: [{
        index: {
            name: 1
        },
        options: {
            unique: true
        }
    }]
})

module.exports = dbModel