const dbSave = require('@finelets/hyper-rest/db/mongoDb/SaveObjectToDb')
module.exports = (schema, data) => {
    return dbSave(schema, data)
        .then((data) => {
            return data.toJSON()
        })
}