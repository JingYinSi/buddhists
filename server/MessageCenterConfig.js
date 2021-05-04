const stringToJavascript = require('@finelets/hyper-rest/utils/StringToJavascript'),
    logger = require('@finelets/hyper-rest/app/Logger')

module.exports = {
    connect: process.env.MQ,
    exchanges: {
        livingforest: {
            isDefault: true,
            publishes: [
            ],
            queues: {
            }
        }
    }
}