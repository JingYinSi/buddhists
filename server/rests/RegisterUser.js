const entity = require('../biz').Employee;

module.exports = {
    url: '/livingforest/auth/users',
    rests: [{
            type: 'create',
            target: 'User',
            handler: (req) => {
                return entity.create(req.body)
            }
        }
    ]
}