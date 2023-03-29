const Employee = require('./bas/Employee'),
    PicGridFs = require('@finelets/hyper-rest/db/mongoDb/GridFs')({bucketName: 'pic'}),
    mqPublish = require('@finelets/hyper-rest/mq')
    
module.exports = {
    Employee, PicGridFs
}