const mongoose = require('mongoose'),
    createCollection = require('@finelets/hyper-rest/db/mongoDb/CreateCollection'),
    createSchema = require('@finelets/hyper-rest/db/mongoDb/CreateSchema'),
    ObjectId = mongoose.Schema.Types.ObjectId;

const dbModel = createCollection({
    name: 'Calendar',
    schema: {
        gongLiDay: {type: String, default: ""},
        zangLiDay: {type: String, default: ""},
        specialDay: {type: String, default: ""},
    },
    indexes: [
        {
            index: {gongLiDay: 1}
        }
    ]
})

module.exports = dbModel