/**
 * Created by clx on 2017/10/13.
 */
const logger = require('@finelets/hyper-rest/app/Logger'),
    users = require('../biz').Employee

module.exports = {
    url: '/api/auth/users/:id/roles',
    rests: [{
            type: 'http',
            method: 'put',
            handler: (req, res) => {
                if(process.env.RUNNING_MODE !== 'rest' && !req.user.isAdmin) return res.status(400).end()
                
                return users.authorize(req.params.id, req.body)
                    .then(ok => {
                        const code = ok ? 204 : 404
                        return res.status(code).end()
                    })
                    .catch((err)=>{
                        logger.error('User authorization error:\r\n' + JSON.stringify(err, null, 2))
                        return res.status(500).end()
                    })
            }
        }
    ]
}
