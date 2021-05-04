/**
 * Created by clx on 2017/10/13.
 */
const logger = require('@finelets/hyper-rest/app/Logger'),
    {findById, update} = require('../biz').Employee

const scopes = {
    info: (user, data) => {
        let {userId, name, pic, email} = data
        return {...user, userId, name, pic, email}
    },
    pwd: (user, data) => {
        if(user.password !== data.oldPwd || !data.password) return undefined
        return {...user, password:data.password}
    }
}
// TODO: 增加一种同当前用户相关的rest服务
// TODO: 需提供测试用例
module.exports = {
    url: '/livingforest/api/currentUser',
    rests: [{
            type: 'http',
            method: 'put',
            handler: (req, res) => {
                const data = req.body
                if(!req.user || !data || !req.query.scope || req.user.id !== data.id) {
                    return res.status(403).end()
                }
                const scope = scopes[req.query.scope]
                if(!scope) {
                    return res.status(403).end()
                }
                
                return findById(data.id)
                    .then(user => {
                        const toUpdate = scope(user, data)
                        if(!toUpdate) return res.status(403).end()
                        return update(toUpdate)
                    })
                    .then(()=> {
                        return res.status(204).end()
                    })
                    .catch((err)=>{
                        logger.error('Update current user rest service:\r\n' + JSON.stringify(err, null, 2))
                        return res.status(500).end()
                    })
            }
        }
    ]
}
