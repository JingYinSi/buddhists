const mongoose = require('mongoose'),
    createCollection = require('@finelets/hyper-rest/db/mongoDb/CreateCollection'),
    ObjectId = mongoose.Schema.Types.ObjectId;

const dbModel = createCollection({
    name: 'Report',
    schema: {
        user: {type: ObjectId, required: true},
        lessonIns: {type: ObjectId, required: true},
        times: {type: Number, default: 0},
        reportDate: Date
    },
    indexes: [
        {
            index: {user: 1}
        },
        {
            index: {lessonIns: 1}
        }
    ]
})

module.exports = dbModel