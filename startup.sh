#!/bin/bash
export RUNNING_MODE=rest
export LOGLEVEL=debug
export PORT=9550
#export MONGODB=mongodb://localhost:27017/Livingforest
export MONGODB=mongodb://localhost:28515/Livingforest
export MQ=amqp://qladapfm:CjtgA21O-1Ux-L108UCR70TcJ4GDpRVh@spider.rmq.cloudamqp.com/qladapfm
export JWT_SECRET=DBCEBERVEQVB1945G4GRG
node --trace-warnings server.js
