const Employee = require('./bas/Employee'),
    PicGridFs = require('@finelets/hyper-rest/db/mongoDb/GridFs')({bucketName: 'pic'})

module.exports = {
    Employee, PicGridFs
}