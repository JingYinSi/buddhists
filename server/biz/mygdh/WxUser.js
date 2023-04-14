const schema = require('../../../db/schema/mygdh/WxUser'),
    createEntity = require('@finelets/hyper-rest/db/mongoDb/DbEntity'),
    mqPublish = require('@finelets/hyper-rest/mq'),
    subDocPath = 'lessonIns',
    reportEntity = require('./Report'),
    lessonEntity = require('./Lesson'),
    lessonSubDocPath = 'instances',
    moment = require('moment'),
    logger = require('@finelets/hyper-rest/app/Logger'),

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
                    pic: '64351a9c1bee875cc0cac898'
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
    updateUserLesson: (msg) => {
        return schema.findById(msg.user).then(doc => {
            let reportDate = moment().format('yyyyMMDD')
            let condi = {'user': msg.user, 'reportDate': reportDate, 'lessonIns': msg.lessonIns}
            let text
            return reportEntity.search(condi, text)
                .then(function (list) {
                    // 用户功课第一次报数 累加今日报数（几门功课）
                    if (list.length <= 1) {
                        doc.dayLessonInsNumber = doc.dayLessonInsNumber + 1
                    }
                    return lessonEntity.findSubDocById(msg.lessonIns, lessonSubDocPath).then(lessonInsDoc => {
                        if (lessonInsDoc && msg.times >= 1) {
                            let reportPopulations = 1
                            if (lessonInsDoc.target && lessonInsDoc.target >= 1) {
                                reportPopulations = Math.ceil(msg.times / lessonInsDoc.target)
                            }
                            // 累加完成功课天数
                            doc.lessonDays = doc.lessonDays + reportPopulations
                            return doc.save()
                        }
                    });
                })
        })
    },
    updateLessonInstance: (msg) => {
        return entity.listSubs(msg.user, subDocPath).then(list => {
            let doc
            if (list) {
                //遍历找到本次报数的功课
                list.forEach(function (item) {
                    if (msg.lessonIns == item.lessonInsId) {
                        doc = item
                    }
                });
            }
            if (doc) {
                return lessonEntity.findSubDocById(msg.lessonIns, subDocPath).then(lessonInsDoc => {
                    if (lessonInsDoc && msg.times >= 1) {
                        let reportPopulations = 1
                        if (lessonInsDoc.target && lessonInsDoc.target >= 1) {
                            reportPopulations = Math.ceil(msg.times / lessonInsDoc.target)
                        }
                        doc.toUpdate = {
                            days: doc.days + reportPopulations,
                            dayTimes: doc.dayTimes + msg.times,
                            weekTimes: doc.weekTimes + msg.times,
                            monthTimes: doc.monthTimes + msg.times,
                            totalTimes: doc.totalTimes + msg.times
                        }
                    }
                    return entity.updateSubDoc(subDocPath, {...doc})
                });
            } else {
                doc = {
                    lessonInsId: msg.lessonIns,
                    days: 1,
                    dayTimes: msg.times,
                    weekTimes: msg.times,
                    monthTimes: msg.times,
                    totalTimes: msg.times
                }
                return entity.createSubDoc(msg.user, subDocPath, doc)
            }
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
                return entity.listSubs(item.id, subDocPath).then(lessonIns => {
                    lessonIns.map(lessonInsItem => {
                        if (jobParam.flag === 'day' && lessonInsItem && lessonInsItem.days >= 1) {
                            lessonInsItem.toUpdate = {
                                days: 0,
                                dayTimes: 0
                            }
                            return entity.updateSubDoc(subDocPath, lessonInsItem)
                        }
                        if (jobParam.flag === 'week' && lessonInsItem && lessonInsItem.weekTimes >= 1) {
                            lessonInsItem.toUpdate = {
                                weekTimes: 0
                            }
                            return entity.updateSubDoc(subDocPath, lessonInsItem)
                        }
                        if (jobParam.flag === 'month' && lessonInsItem && lessonInsItem.monthTimes >= 1) {
                            lessonInsItem.toUpdate = {
                                monthTimes: 0
                            }
                            return entity.updateSubDoc(subDocPath, lessonInsItem)
                        }
                    })
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