/**
 * Created by clx on 2017/10/13.
 */
const logger = require('@finelets/hyper-rest/app/Logger'),
    users = require('../biz').Employee

module.exports = {
    url: '/wx/api/auth/users/:id/password',
    rests: [{
            type: 'http',
            method: 'put',
            handler: (req, res) => {
                const id = req.params.id
                if(process.env.RUNNING_MODE !== 'rest' && id !== req.user.id) return res.status(400).end()
                
                return users.updatePassword(id, req.body)
                    .then(ok => {
                        const code = ok ? 204 : 404
                        return res.status(code).end()
                    })
                    .catch((err)=>{
                        logger.error("Update user's password error:\r\n" + JSON.stringify(err, null, 2))
                        return res.status(500).end()
                    })
            }
        }
    ]
}
