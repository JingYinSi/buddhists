const mongoose = require('mongoose'),
    createCollection = require('@finelets/hyper-rest/db/mongoDb/CreateCollection')

const dbModel = createCollection({
    name: 'Recommend',
    schema: {
        name: {type: String, required: true},
        pic: {type: String, required: true},
        link: {type: String, required: true},
        desc: String,
        enable: {type: Number, default: 1}
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