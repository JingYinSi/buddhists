const entity = require('../biz/mygdh/WxUser');

module.exports = {
    url: '/wx/auth/users',
    rests: [{
            type: 'create',
            target: 'User',
            handler: (req) => {
                return entity.create(req.body)
            }
        }
    ]
}