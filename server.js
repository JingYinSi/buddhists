const fs = require("fs"),
	createServer = require("@finelets/hyper-rest/express/CreateServer"),
	messageCenterConfig = require("./server/MessageCenterConfig"),
	jwtConfig = require("./server/JwtConfig")(),
	flow = require("./server/Flow");

let config = {
	appName: "livingforest",
	baseDir: __dirname,
	messageCenterConfig,
	jwtConfig,
	flow,
};

if (process.env.HTTPS) {
	const cert = {
		key: fs.readFileSync("./.cert/privkey.pem"),
		cert: fs.readFileSync("./.cert/fullchain.pem")
	}
	config = {...config, cert}
}

createServer(config);
