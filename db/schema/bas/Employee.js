const createCollection = require('@finelets/hyper-rest/db/mongoDb/CreateCollection')

const dbModel = createCollection({
    name: 'Employee',
    schema: {
        userId: String,
        name: {type:String, required:true},
        password: String,
        pic: String,
        email: String,
        isAdmin: Boolean,
        roles: String,
        inUse: Boolean
    },
    indexes: [
        {
            index: {name: 1},
            options: {unique: true}
        },
        {
            index: {userId: 1},
            options: {unique: true}
        }
    ]
})

module.exports = dbModel