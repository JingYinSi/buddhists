const schema = require('../../../db/schema/bas/Employee'),
    createEntity = require('@finelets/hyper-rest/db/mongoDb/DbEntity'),
    mqPublish = require('@finelets/hyper-rest/mq'),
    {extend} = require('underscore')

const config = {
    schema,
    projection: {password: 0},
    updatables: ['userId', 'name', 'email'],
    searchables: ['userId', 'name', 'email'],
    listable: {password: 0, pic: 0, email: 0, isAdmin: 0, roles: 0, inUse: 0},
    setValues: (doc, data) => {
        // do nothing but an example
        /* if (data.userId && !doc.password) {
            doc.password = '9'
        } */
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

const entity = createEntity(config)

const obj = {
    authenticate: (userName, password) => {
        return schema.findOne({
                userId: userName,
                password: password,
                inUse: true
            }, ['userId', 'name', 'email', 'pic', 'isAdmin', 'roles'])
            .then(doc => {
                if (doc) {
                    return doc.toJSON()
                }
            })
    },

    authorize: (_id, { __v, isAdmin, roles }) => {
        return schema.findById(_id)
        .then(doc => {
            if (doc && doc.__v === __v) {
                if(isAdmin) {
                    doc.inUse = true
                    doc.isAdmin = true
                    doc.roles = undefined
                } else if(roles) {
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
            if(data) data = data.toJSON()
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
                if(oldPic) {
                    mqPublish['removePic'](oldPic)
                }
            })
    },
    searchUsers: (cond, text, sort) => {
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
        return entity.search(finalCond, text, sort)
    }
}


/* const search = entity.search
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
} */

module.exports = extend(entity, obj)