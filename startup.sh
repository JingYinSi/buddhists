#!/bin/bash
# export RUNNING_MODE=rest
export LOGLEVEL=debug
export PORT=443
export MONGODB=mongodb+srv://clx:980425@cluster0.eikoo.mongodb.net/livingforest?retryWrites=true&w=majority
#export MONGODB=mongodb://localhost:28515/Livingforest
#export MQ=amqp://qladapfm:CjtgA21O-1Ux-L108UCR70TcJ4GDpRVh@spider.rmq.cloudamqp.com/qladapfm
export MQ=amqp://jsm:jsm@localhost:5672
export JWT_SECRET=DBCEBERVEQVB1945G4GRG
export AppId=wxc6f15800d186154e
export AppSecret=593222138835dae2bbd53d83b7bad6b5
node --trace-warnings server.js
