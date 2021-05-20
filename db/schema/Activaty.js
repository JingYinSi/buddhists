const mongoose = require('mongoose'),
    createCollection = require('@finelets/hyper-rest/db/mongoDb/CreateCollection'),
    createSchema = require('@finelets/hyper-rest/db/mongoDb/CreateSchema'),
    ObjectId = mongoose.Schema.Types.ObjectId;

const lessonSchema = createSchema({
    lesson: {type: ObjectId, required: true},
    start: Date,
    times: {type: Number, default: 0},
    quantity: {type: Number, default: 0}
})

const stageSchema = createSchema({
        start: Date,
        name: String,
        lessons: [lessonSchema]
    })

const dbModel = createCollection({
    name: 'Activaty',
    schema: {
        name: {type: String, required: true},
        stages: [stageSchema],
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