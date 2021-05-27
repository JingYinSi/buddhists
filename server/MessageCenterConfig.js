const logger = require('@finelets/hyper-rest/app/Logger'),
    {Employee, PicGridFs} = require('./biz'),
    {withApply} = require('./biz/Activaty')

module.exports = {
    connect: process.env.MQ,
    exchanges: {
        livingforest: {
            isDefault: true,
            publishes: [
                'employeePicChanged',
                'removePic',
                'apply'
            ],
            queues: {
                EmployeePicChanged: {
                    topic: 'employeePicChanged',
                    consumer: ({
                        id,
                        pic
                    }) => {
                        logger.debug(`handle message employeePicChanged: {id: ${id}, pic: ${pic}}`)
                        return Employee.updatePic(id, pic)
                            .then(() => {
                                return true
                            })
                            .catch(e => {
                                return true
                            })
                    }
                },
                RemovePic: {
                    topic: 'removePic',
                    consumer: (pic) => {
                        logger.debug(`handle message removePic: ${pic}`)
                        return PicGridFs.remove(pic)
                            .then(() => {
                                return true
                            })
                            .catch(e => {
                                return true
                            })
                    }
                },
                Apply: {
                    topic: 'apply',
                    consumer: (msg) => {
                        logger.debug(`handle apply message: ${JSON.stringify(msg, null, 2)}`)
                        return withApply(msg)
                    }
                }
            }
        }
    }
}