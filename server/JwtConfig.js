const
    // userMgr = require('./biz/bas/Employee'),
    jwt = require('jsonwebtoken'),
    sessionMgr = require('@finelets/hyper-rest/jwt/WxSessions'),
    userMgr = require('@finelets/hyper-rest/usermgr/Users'),
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

const baseUrl = '/wx/api',
    loginUrl = '/wx/auth/login'

let __authenticate, __getUser, __haveAdmin
let __wx_session_key
const Appid = process.env.AppId,
    AppSecret = process.env.AppSecret,
    jwtSecret = process.env.JWT_SECRET,
    expiresIn = process.env.SessionExpiresIn
const defaultSignOptions = {
    issuer: 'finelets',
    expiresIn: "12h",
    algorithm: "HS256"
}
defaultSignOptions.expiresIn = expiresIn || defaultSignOptions.expiresIn
if (!Appid || !AppSecret || !jwtSecret)
    throw 'To use WxJwtAuthenticate, you must set env AppSecret, JWT_SECRET, SessionExpiresIn correctly'
const config = {
    // forAll: (token)=>{
    //     logger.debug("forAll forAll forAll forAll forAll forAll")
    //     return Promise.resolve({token})
    // },
    forAll: (token) => {
        logger.debug("forAll forAll forAll forAll forAll forAll")
        let decode
        try {
            decode = jwt.verify(token, jwtSecret, defaultSignOptions)

        } catch (err) {
            return sessionMgr.removeToken(token)
        }

        const {user, openid} = decode
        if (openid) {
            return sessionMgr.findByOpenId(openid)
                .then(session => {
                    if (!session) return
                    let sessionUser = {openid, session_key: session.session_key}
                    if (!user) return sessionUser
                    return userMgr.getUser(user)
                        .then(data => {
                            return {...sessionUser, user: data}
                        })
                })
        }
        return userMgr.getUser(user)
    },
    authenticate: (username, password) => {
        logger.debug("authenticate authenticate authenticate authenticate authenticate")
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
    logger.debug("create create create create create create")
    dbAuth = dbAuth || employeeEntity
    __forAll = dbAuth.forAll
    __authenticate = dbAuth.authenticate
    __getUser = dbAuth.getUser || dbAuth.findById
    __haveAdmin = dbAuth.haveAdmin
    return config
}

module.exports = create