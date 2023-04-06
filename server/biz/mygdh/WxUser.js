const schema = require('../../../db/schema/mygdh/WxUser'),
    createEntity = require('@finelets/hyper-rest/db/mongoDb/DbEntity'),
    mqPublish = require('@finelets/hyper-rest/mq'),
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
    projection: {email: 0, userId: 0, openid: 0},
    updatables: ['userId', 'name', 'openid', 'email', 'pic'],
    searchables: ['userId', 'name', 'openid', 'email', 'pic'],
    listable: {email: 0, userId: 0, openid: 0},
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
                return entity.create({userId: openid, name: name, openid: openid})
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

    updatePic: (id, pic) => {
        let oldPic

        return schema.findById(id)
            .then(doc => {
                oldPic = doc.pic
                doc.pic = pic
                return doc.save()
            })
            .then(() => {
                if (oldPic) {
                    mqPublish['removePic'](oldPic)
                }
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