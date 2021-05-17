#!/bin/bash
export RUNNING_MODE=dev
export LOGLEVEL=debug
export SERIAL_PORT=ON
export PORT=9510
export mongodb://localhost:27017/Livingforest
export amqp://qladapfm:CjtgA21O-1Ux-L108UCR70TcJ4GDpRVh@spider.rmq.cloudamqp.com/qladapfm
export JWT_SECRET=DBCEBERVEQVB1945G4GRG
node --trace-warnings server.js
