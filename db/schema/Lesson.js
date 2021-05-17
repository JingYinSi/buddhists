const mongoose = require('mongoose'),
    createCollection = require('@finelets/hyper-rest/db/mongoDb/CreateCollection'),
    createSchema = require('@finelets/hyper-rest/db/mongoDb/CreateSchema'),
    ObjectId = mongoose.Schema.Types.ObjectId;

const applySchema = createSchema({
        date: {type: Date, default: Date.now },
        quantity: {type: Number, default: 0},
        creator: ObjectId
    })

const dbModel = createCollection({
    name: 'Lesson',
    schema: {
        code: {type: String, required: true},
        name: {type: String, required: true},
        desc: String,
        applies: [applySchema],
        start: Date,
        times: {type: Number, default: 0},
        quantity: {type: Number, default: 0}
    },
    indexes: [{
        index: {
            name: 1
        },
        options: {
            unique: true
        }
    },
    {
        index: {
            code: 1
        },
        options: {
            unique: true
        }
    }]
})

module.exports = dbModel