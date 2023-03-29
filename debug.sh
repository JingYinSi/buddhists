export RUNNING_MODE=prod
export LOGLEVEL=debug
export PORT=9510
export MONGODB=mongodb://192.168.5.166:27017/wx
export MQ=amqp://jsm:jsm@192.168.5.166
export JWT_SECRET=DBCEBERVEQVB1945G4GRG
node server.js
