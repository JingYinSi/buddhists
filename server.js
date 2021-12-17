const fs = require("fs"),
	createServer = require("@finelets/hyper-rest/express/CreateWxServer"),
	messageCenterConfig = require("./server/MessageCenterConfig"),
	flow = require("./server/Flow");

let config = {
	appName: "livingforest",
	baseDir: __dirname,
	messageCenterConfig,
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
