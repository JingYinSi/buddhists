logger = require('@finelets/hyper-rest/app/Logger'),
axios = require('axios');

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
let __wx_session_key
const config = {
    authenticate: (username, password) => {
        let {code} = username
        if (!code) {
            logger.error("We havent received the code from client")
            return Promise.resolve();
        }
        let url = `https://api.weixin.qq.com/sns/jscode2session?appid=${process.env.AppId}&secret=${process.env.AppSecret}&js_code=${code}&grant_type=authorization_code`
        return axios.get(url)
            .then(res => {
                logger.debug("login to wx by code: " + JSON.stringify(res.data, null, 2))
                __wx_session_key = res.data.session_key
                return {id: res.data.openid}
            })
    },
    getUser: (id) => {
        return Promise.resolve({id})
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