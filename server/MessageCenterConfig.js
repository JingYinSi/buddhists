const logger = require('@finelets/hyper-rest/app/Logger'),
    PicGridFs = require('./biz').PicGridFs
const Lesson = require('./biz/mygdh/Lesson'),
    WxUser = require('./biz/mygdh/WxUser')
module.exports = {
    connect: process.env.MQ,
    exchanges: {
        wx: {
            isDefault: true,
            publishes: [
                'wxUserPicChanged',
                'removePic',
                'apply',
                'reportCreated',
                'lessonPicChanged',
                'lessonIconChanged',
                'lessonIncantationChanged'
            ],
            queues: {
                WxUserPicChanged: {
                    topic: 'wxUserPicChanged',
                    consumer: ({
                                   id,
                                   pic
                               }) => {
                        logger.debug(`handle message wxUserPicChanged: {id: ${id}, pic: ${pic}}`)
                        return WxUser.updatePic(id, pic)
                            .then(() => {
                                return true
                            })
                            .catch(e => {
                                return true
                            })
                    }
                },
                LessonPicChanged: {
                    topic: 'lessonPicChanged',
                    consumer: ({
                                   id,
                                   pic
                               }) => {
                        logger.debug(`handle message lessonPicChanged: {id: ${id}, pic: ${pic}}`)
                        return Lesson.updatePic(id, pic)
                            .then(() => {
                                return true
                            })
                            .catch(e => {
                                return true
                            })
                    }
                },
                lessonIconChanged: {
                    topic: 'lessonIconChanged',
                    consumer: ({
                                   id,
                                   icon
                               }) => {
                        logger.debug(`handle message lessonIconChanged: {id: ${id}, icon: ${icon}}`)
                        return Lesson.updateIcon(id, icon)
                            .then(() => {
                                return true
                            })
                            .catch(e => {
                                return true
                            })
                    }
                },
                lessonIncantationChanged: {
                    topic: 'lessonIncantationChanged',
                    consumer: ({
                                   id,
                                   icon
                               }) => {
                        logger.debug(`handle message lessonIncantationChanged: {id: ${id}, icon: ${icon}}`)
                        return Lesson.updateIncantation(id, icon)
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
                        // 累加课程功课总报数
                        return Lesson.updateLessonInstance(msg)
                            .then(() => {
                                // 累加用户的功课完成天数
                                return WxUser.updateUserLesson(msg)
                                    .then(() => {
                                        // 累加用户的功课报数
                                        return WxUser.updateLessonInstance(msg)
                                            .then(() => {
                                                return true
                                            })
                                    })
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