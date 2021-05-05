const createCollection = require('@finelets/hyper-rest/db/mongoDb/CreateCollection')

const dbModel = createCollection({
    name: 'Lesson',
    schema: {
        code: {type: String, required: true},
        name: {type: String, required: true},
        desc: String
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