const logger = require('@finelets/hyper-rest/app/Logger'),
    {Employee, PicGridFs} = require('./biz')
const Lesson = require('./biz/mygdh/Lesson')
module.exports = {
    connect: process.env.MQ,
    exchanges: {
        wx: {
            isDefault: true,
            publishes: [
                'employeePicChanged',
                'removePic',
                'apply',
                'reportCreated'
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
                ReportCreated: {
                    topic: 'reportCreated',
                    consumer: (msg) => {
                        logger.debug(`handle message reportCreated: ${msg}`)
                        return Lesson.updateLessonInstance(msg)
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