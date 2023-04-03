const mongoose = require('mongoose'),
    createCollection = require('@finelets/hyper-rest/db/mongoDb/CreateCollection'),
    ObjectId = mongoose.Schema.Types.ObjectId;

const dbModel = createCollection({
    lessonIns: {type: ObjectId, required: true},
    name: 'Report',
    schema: {
        user: {type: String, required: true},
        lessonIns: {type: String, required: true},
        times: {type: Number, default: 0},
        reportDate: Date
    },
    indexes: [{
        index: {
            user: 1
        }
    }]
})

module.exports = dbModel