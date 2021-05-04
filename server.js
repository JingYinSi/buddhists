const createServer = require('@finelets/hyper-rest/express/CreateServer'),
	messageCenterConfig = require('./server/MessageCenterConfig'),
	jwtConfig = require('./server/JwtConfig')(),
	flow = require('./server/Flow')

const config = {
	appName: 'livingforest',
	baseDir: __dirname,
	messageCenterConfig,
	jwtConfig,
	flow
}

createServer(config)