const Lesson = require('../../server/biz/Lesson');

const mongoose = require('mongoose'),
    createCollection = require('@finelets/hyper-rest/db/mongoDb/CreateCollection'),
    createSchema = require('@finelets/hyper-rest/db/mongoDb/CreateSchema'),
    ObjectId = mongoose.Schema.Types.ObjectId;


const stageSchema = createSchema({
        start: Date,
        name: String,
        lessons: [ObjectId]
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