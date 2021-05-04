const employeeEntity = require('./biz').Employee,
    DEFAULT_ADMIN_ID = '$$$$livingforest$$admin',
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

const baseUrl = '/livingforest/api',
    loginUrl = '/livingforest/auth/login'

let __authenticate, __getUser, __haveAdmin
const config = {
    authenticate: (username, password) => {
        if (username === DEFAULT_ADMIN_NAME && password === DEFAULT_ADMIN_PWD) {
            if (!__haveAdmin) return Promise.resolve(DEFAULT_ADMIN)

            return __haveAdmin()
                .then((countOfAdmin) => {
                    if (countOfAdmin < 1) return Promise.resolve(DEFAULT_ADMIN)
                    return Promise.resolve()
                })
        }
        return __authenticate(username, password)
    },
    getUser: (id) => {
        if (id === DEFAULT_ADMIN_ID) return Promise.resolve({isAdmin: true})
        return __getUser(id)
    },
    baseUrl,
    loginUrl
}

function create(dbAuth) {
    dbAuth = dbAuth || employeeEntity
    __authenticate = dbAuth.authenticate
    __getUser = dbAuth.getUser || dbAuth.findById
    __haveAdmin = dbAuth.haveAdmin
    return config
}

module.exports = create