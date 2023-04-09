const entity = require('../biz/mygdh/WxUser')

module.exports = {
    url: '/api/auth/users',
    rests: [{
            type: 'create',
            target: 'User',
            handler: (req) => {
                return entity.create(req.body)
            }
        }
    ]
}