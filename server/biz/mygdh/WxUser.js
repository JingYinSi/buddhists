const
    schema = require('../../../db/schema/mygdh/WxUser'),
    createEntity = require('@finelets/hyper-rest/db/mongoDb/DbEntity'),
    mqPublish = require('@finelets/hyper-rest/mq'),
    subDocPath = 'lessonIns',
    reportEntity = require('./Report'),
    lessonEntity = require('./Lesson'),
    logger = require('@finelets/hyper-rest/app/Logger'),
    _ = require('lodash'),
    UNKNOWN_WECHAT_NAME = "Unknown Wechat User",
    DEFAULT_ADMIN_ID = '$$$$defaultuserid$$admin',
    DEFAULT_ADMIN_NAME = '@admin@',
    DEFAULT_ADMIN_PWD = '$9999$',
    DEFAULT_ADMIN_INFO = {
        name: '系统管理员',
        isAdmin: true
    },
    DEFAULT_ADMIN = {
        id: DEFAULT_ADMIN_ID,
        ...DEFAULT_ADMIN_INFO
    }

const config = {
    schema,
    projection: {userId: 0, openid: 0},
    updatables: ['name', 'prov', 'city', 'district'],
    searchables: ['userId', 'name', 'openid', 'pic', 'prov', 'city', 'district'],
    listable: {userId: 0, openid: 0},
    setValues: (doc, data) => {
    }
}

const obj = {
    createWechatUser: ({id, openid}) => {
        if (id) {
            return schema.findById(id, config.projection)
                .then(doc => {
                    let obj = doc.toJSON()
                    if (doc.openid === openid) return obj
                    doc.openid = openid
                    doc.userId = openid
                    return doc.save()
                        .then(() => {
                            return schema.findById(id, config.projection)
                        })
                        .then(doc => {
                            return schema.updateMany({openid, id: {$ne: id}}, {$unset: {openid: undefined}})
                                .then(() => {
                                    return doc.toJSON()
                                })

                        })
                })
        }
        return schema.findOne({openid}, config.projection)
            .then(doc => {
                if (doc) return doc.toJSON()
                let name = UNKNOWN_WECHAT_NAME
                if (openid && openid.length >= 6) {
                    name = openid.substring(openid.length - 6)
                }
                return entity.create({
                    userId: openid,
                    name: name,
                    openid: openid,
                    prov: '',
                    city: '',
                    district: '',
                    pic: process.env.USER_DEFAULT_AVATAR
                })
            })
    },

    getUser: (id) => {
        if (id === DEFAULT_ADMIN_ID) return Promise.resolve({isAdmin: true})
        return schema.findById(id, {password: 0, __v: 0, createdAt: 0, updatedAt: 0})
            .then(doc => {
                if (doc) return doc.toJSON()
            })
    },

    authenticate: (userName, password) => {
        if (userName === DEFAULT_ADMIN_NAME && password === DEFAULT_ADMIN_PWD) {
            return schema.count({isAdmin: true})
                .then((countOfAdmin) => {
                    if (countOfAdmin === 0) return Promise.resolve(DEFAULT_ADMIN)
                    return Promise.resolve()
                })
        }
        return schema.findOne({
            userId: userName,
            password: password,
            inUse: true
        }, ['userId', 'name', 'openid', 'email', 'pic', 'isAdmin', 'roles'])
            .then(doc => {
                if (doc) {
                    return doc.toJSON()
                }
            })
    },

    authorize: (_id, {__v, isAdmin, roles}) => {
        return schema.findById(_id)
            .then(doc => {
                if (doc && doc.__v === __v) {
                    if (isAdmin) {
                        doc.inUse = true
                        doc.isAdmin = true
                        doc.roles = undefined
                    } else if (roles) {
                        doc.inUse = true
                        doc.isAdmin = undefined
                        doc.roles = roles
                    } else {
                        doc.inUse = undefined
                        doc.isAdmin = undefined
                        doc.roles = undefined
                    }
                    return doc.save()
                }
            })
            .then(data => {
                if (data) data = data.toJSON()
                return data
            })
            .catch(e => {
                if (e.name === 'CastError') return false
                throw e
            })
    },

    updatePassword: (_id, {oldPassword, password}) => {
        return schema.updateOne({_id, password: oldPassword}, {$set: {password}})
            .then(data => {
                return data.n === 1 && data.nModified === 1 && data.ok === 1
            })
            .catch(e => {
                if (e.name === 'CastError') return false
                throw e
            })
    },

    updatePrayerText: (_id, {oldPrayerText, prayerText}) => {
        return schema.updateOne({_id, password: oldPrayerText}, {$set: {prayerText}})
            .then(data => {
                return data.n === 1 && data.nModified === 1 && data.ok === 1
            })
            .catch(e => {
                if (e.name === 'CastError') return false
                throw e
            })
    },

    updatePic: (id, pic) => {
        let oldPic

        return schema.findById(id)
            .then(doc => {
                oldPic = doc.pic
                doc.pic = pic
                return doc.save()
            })
            .then(() => {
                // 不删除默认头像
                if (oldPic && oldPic !== process.env.USER_DEFAULT_AVATAR) {
                    mqPublish['removePic'](oldPic)
                }
            })
    },
    updateDayLessons: (msg) => {
        return schema.findById(msg.user).then(doc => {
            reportEntity.todayUserLessonReportCount(msg.user, msg.lessonIns).then(function (count) {
                if (count === 1) { // 用户功课第一次报数 累加今日报数（几门功课）
                    doc.dayLessonInsNumber = doc.dayLessonInsNumber + 1
                    return doc.save()
                }
            })
        })
    },
    findUserInstance: (userId, instanceId) => {
        return entity.listSubs(userId, subDocPath).then(userLessonInstances => {
            const promise = new Promise((resolve, reject) => {
                let userLessonInstance = _.find(userLessonInstances, {lessonInsId: instanceId})
                resolve(userLessonInstance)
            });
            return promise;
        })
    },
    updateLessonReport: (msg) => {
        return entity.findUserInstance(msg.user, msg.lessonIns).then(userLessonIns => {
            return lessonEntity.findLessonInstance(msg.lessonIns).then(lessonIns => {
                if (!lessonIns) {
                    logger.error("can't find lesson instance by id(" + msg.lessonIns + ")")
                    return false
                }

                reportEntity.todayUserLessonReportCount(msg.user, msg.lessonIns).then(function (todayReportCount) {
                    let totalTimes = 0
                    let days = 0
                    if (!userLessonIns) { //首次创建用户课程实例
                        totalTimes = msg.times
                        if (lessonIns.hasTarget()) {
                            days = lessonIns.calculateTargetDays(totalTimes)
                        } else if (todayReportCount >= 1) {
                            days = 1
                        }
                        userLessonIns = {
                            lessonInsId: msg.lessonIns,
                            days: days,
                            dayTimes: msg.times,
                            weekTimes: msg.times,
                            monthTimes: msg.times,
                            totalTimes: totalTimes
                        }
                        return entity.createSubDoc(msg.user, subDocPath, userLessonIns)
                    } else {//更新用户课程实例报数
                        totalTimes = userLessonIns.totalTimes + msg.times
                        days = userLessonIns.days
                        if (lessonIns.hasTarget()) {
                            days = lessonIns.calculateTargetDays(totalTimes)
                        } else if (todayReportCount === 1) {
                            days = days + 1
                        }
                        userLessonIns.toUpdate = {
                            dayTimes: userLessonIns.dayTimes + msg.times,
                            weekTimes: userLessonIns.weekTimes + msg.times,
                            monthTimes: userLessonIns.monthTimes + msg.times,
                            totalTimes: totalTimes,
                            days: days
                        }
                        return entity.updateSubDoc(subDocPath, {...userLessonIns})
                    }
                })
            })
        }).catch(e => {
            if (e.name === 'CastError') return false
            throw e
        })
    },
    resetUserLesson: (jobParam) => {
        return schema.updateMany({dayLessonInsNumber: {$gte: 0}}, {$set: {dayLessonInsNumber: 0}})
            .catch(e => {
                if (e.name === 'CastError') return false
                throw e
            })
    },
    resetUserLessonIns: (jobParam) => {
        return schema.find().then((list) => {
            list.forEach(item => {
                entity.listSubs(item.id, subDocPath).then(lessonIns => {
                    if (lessonIns.length > 0) {
                        // 行子文档所有subid
                        let lessonInsItemIds = []
                        let lessonInsItemLast
                        lessonIns.forEach(lessonInsItem => {
                            lessonInsItemIds.push(lessonInsItem.id)
                            lessonInsItemLast = lessonInsItem
                        })
                        if (jobParam.flag === 'day' && lessonInsItemLast) {
                            lessonInsItemLast.toUpdate = {
                                dayTimes: 0
                            }
                            return entity.updateManySubDoc(subDocPath, lessonInsItemLast, lessonInsItemIds)
                        }
                        if (jobParam.flag === 'week' && lessonInsItemLast) {
                            lessonInsItemLast.toUpdate = {
                                weekTimes: 0
                            }
                            return entity.updateManySubDoc(subDocPath, lessonInsItemLast, lessonInsItemIds)
                        }
                        if (jobParam.flag === 'month' && lessonInsItemLast) {
                            lessonInsItemLast.toUpdate = {
                                monthTimes: 0
                            }
                            return entity.updateManySubDoc(subDocPath, lessonInsItemLast, lessonInsItemIds)
                        }
                    }

                })
            })
        })
            .catch(e => {
                if (e.name === 'CastError') return false
                throw e
            })
    }
}

const types = {
    ALL: {},
    NONUSER: {
        inUse: {
            $ne: true
        },
        isAdmin: {
            $ne: true
        }
    },
    ALLUSER: {
        $or: [{
            inUse: true
        }, {
            isAdmin: true
        }]
    },
    ADMIN: {
        isAdmin: true
    },
    NONADMINUSER: {
        inUse: true,
        isAdmin: {
            $ne: true
        }
    },
}

const entity = createEntity(config, obj)
const search = entity.search
entity.search = (cond, text, sort) => {
    let finalCond = {
        ...cond
    }
    if (finalCond.TYPE) {
        const condType = finalCond.TYPE
        delete finalCond.TYPE
        if (types[condType]) finalCond = {
            ...finalCond,
            ...types[condType]
        }
    }
    return search(finalCond, text, sort)
}

module.exports = entity