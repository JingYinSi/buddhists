const
    jwt = require('jsonwebtoken'),
    sessionMgr = require('@finelets/hyper-rest/jwt/WxSessions'),
    userMgr = require('./biz/mygdh/WxUser'),
    logger = require('@finelets/hyper-rest/app/Logger'),
    axios = require('axios');

const wxUserEntity = require('./biz/mygdh/WxUser'),
    DEFAULT_ADMIN_ID = '$$$$wx$$admin',
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
    expiresIn: "720h",
    algorithm: "HS256"
}
defaultSignOptions.expiresIn = expiresIn || defaultSignOptions.expiresIn
if (!Appid || !AppSecret || !jwtSecret)
    throw 'To use WxJwtAuthenticate, you must set env AppSecret, JWT_SECRET, SessionExpiresIn correctly'
const config = {
    forAll: (token) => {
        logger.debug("forAll forAll forAll forAll forAll forAll:" + token)
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
    authenticate: ({code, username, password}) => {
        let token

        if (!code) {
            return userMgr.authenticate(username, password)
                .then(user => {
                    if (user) {
                        token = jwt.sign({user: user.id}, jwtSecret, defaultSignOptions)
                        return {user, token}
                    }
                    return
                })
        }

        if (process.env.RUNNING_MODE !== 'rest') {
            let url = `https://api.weixin.qq.com/sns/jscode2session?appid=${Appid}&secret=${AppSecret}&js_code=${code}&grant_type=authorization_code`
            return axios.get(url)
                .then(res => {
                    const {openid, session_key, errmsg} = res.data

                    if (errmsg) throw new Error(`Wechat login fail: ${errmsg}`)

                    if (username) {
                        return userMgr.authenticate(username, password)
                            .then(user => {
                                if (user) {
                                    token = jwt.sign({openid, user: user.id}, jwtSecret, defaultSignOptions)
                                    return sessionMgr.create({token, openid, userId: user.id, session_key})
                                        .then(() => {
                                            return userMgr.createWechatUser({id: user.id, openid})
                                        })
                                        .then((data) => {
                                            return {user: data, token}
                                        })
                                }
                                return
                            })
                    }
                    token = jwt.sign({openid}, jwtSecret, defaultSignOptions)
                    return sessionMgr.create({token, openid, session_key})
                        .then(() => {
                            return userMgr.createWechatUser({openid})
                        })
                        .then((user) => {
                            return {user, token}
                        })
                })
        } else {
            let openid = code
            let session_key = "222"
            let errmsg = ""

            if (errmsg) throw new Error(`Wechat login fail: ${errmsg}`)

            if (username) {
                return userMgr.authenticate(username, password)
                    .then(user => {
                        if (user) {
                            token = jwt.sign({openid, user: user.id}, jwtSecret, defaultSignOptions)
                            return sessionMgr.create({token, openid, userId: user.id, session_key})
                                .then(() => {
                                    return userMgr.createWechatUser({id: user.id, openid})
                                })
                                .then((data) => {
                                    return {user: data, token}
                                })
                        }
                        return
                    })
            }
            token = jwt.sign({openid}, jwtSecret, defaultSignOptions)
            return sessionMgr.create({token, openid, session_key})
                .then(() => {
                    return userMgr.createWechatUser({openid})
                })
                .then((user) => {
                    return {user, token}
                })
        }

    },
    getUser: (id) => {
        return Promise.resolve({id})
    },
    baseUrl,
    loginUrl
}

function create(dbAuth) {
    dbAuth = dbAuth || wxUserEntity
    __forAll = dbAuth.forAll
    __authenticate = dbAuth.authenticate
    __getUser = dbAuth.getUser || dbAuth.findById
    __haveAdmin = dbAuth.haveAdmin
    return config
}

module.exports = create