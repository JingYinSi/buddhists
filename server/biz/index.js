const Employee = require('./bas/Employee'),
    PicGridFs = require('@finelets/hyper-rest/db/mongoDb/GridFs')({bucketName: 'pic'}),
    mqPublish = require('@finelets/hyper-rest/mq'),
    createApply = require('./Apply')

const Apply = createApply((msg) => {
        mqPublish['apply'](msg)
    })
    
module.exports = {
    Employee, PicGridFs, Apply
}