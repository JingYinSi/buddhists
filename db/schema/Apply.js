const mongoose = require('mongoose'),
    createCollection = require('@finelets/hyper-rest/db/mongoDb/CreateCollection'),
    ObjectId = mongoose.Schema.Types.ObjectId;

const dbModel = createCollection({
    name: 'Apply',
    schema: {
        date: {type: Date, default: Date.now },
        lesson: {type: ObjectId, required: true},
        quantity: {type: Number, default: 0},
        creator: {type: ObjectId, required: true}
    },
    indexes: [{
        index: {
            lesson: 1,
            creator: 1
        }
    }]
})

module.exports = dbModel