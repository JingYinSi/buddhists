const mongoose = require('mongoose'),
    createCollection = require('@finelets/hyper-rest/db/mongoDb/CreateCollection'),
    ObjectId = mongoose.Schema.Types.ObjectId;

const dbModel = createCollection({
    name: 'Suggestion',
    schema: {
        user: {type: ObjectId, required: true},
        text: String
    }, indexes: [{
        index: {user: 1}
    }]
})

module.exports = dbModel