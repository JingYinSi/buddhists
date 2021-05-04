const logger = require('@finelets/hyper-rest/app/Logger'),
    {Employee, PicGridFs} = require('./biz')

module.exports = {
    connect: process.env.MQ,
    exchanges: {
        textrade: {
            isDefault: true,
            publishes: [
                'employeePicChanged',
                'removePic'
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
                }
            }
        }
    }
}