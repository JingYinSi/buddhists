const schema = require('../../../db/schema/mygdh/WxUser'),
    createEntity = require('@finelets/hyper-rest/db/mongoDb/DbEntity'),
    mqPublish = require('@finelets/hyper-rest/mq'),
    subDocPath = 'lessonIns',
    reportEntity = require('./Report'),
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
                return entity.create({userId: openid, name: name, openid: openid, prov: '', city: '', district: '', pic: '64351a9c1bee875cc0cac898'})
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
                // 不删除默认头像64351a9c1bee875cc0cac898
                if (oldPic && oldPic !== '64351a9c1bee875cc0cac898') {
                    mqPublish['removePic'](oldPic)
                }
            })
    },
    updateUserLesson: (msg) => {
        return schema.findById(msg.user).then(doc => {
            let reportDate = new Date().toLocaleDateString('zh').replaceAll('/', '')
            let condi = {'user': msg.user, 'reportDate': reportDate, 'lessonIns': msg.lessonIns}
            let text
            return reportEntity.search(condi, text)
                .then(function (list) {
                    //用户功课第一次报数 累加报数天数
                    if (list.length <= 1) {
                        doc.dayLessonInsNumber = doc.dayLessonInsNumber + 1
                        doc.lessonDays = doc.lessonDays + 1
                        return doc.save()
                    }
                })
        })
    },
    updateLessonInstance: (msg) => {
        return entity.listSubs(msg.user, subDocPath).then(list => {
            let doc
            if (list) {
                list.forEach(function (item) {
                    if (msg.lessonIns == item.lessonInsId) {
                        doc = item
                    }
                });
            }
            if (doc) {
                doc.toUpdate = {
                    days: doc.days + 1,
                    dayTimes: doc.dayTimes + msg.times,
                    weekTimes: doc.weekTimes + msg.times,
                    monthTimes: doc.monthTimes + msg.times,
                    totalTimes: doc.totalTimes + msg.times
                }
                return entity.updateSubDoc(subDocPath, {...doc})
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