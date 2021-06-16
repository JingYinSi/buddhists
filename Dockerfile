FROM node:latest

# Provides cached layer for node_modules
ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /app && cp -a /tmp/node_modules /app/

# Define working directory
WORKDIR /app
ADD . /app

ENV RUNNING_MODE=rest
ENV PORT=9510
ENV MONGODB=mongodb://livingforestdb:27017/livingforest
ENV CLIENT_ORIGIN=http://192.168.5.166/jsmetta
ENV MQ=amqp://jsm:jsm@rabbitmq
ENV JWT_SECRET=MFswDQYJKoZIhvcNAQEBBQADSgAwRwJAamUL/pm3t5EZ

# Expose port
EXPOSE  9510

# Run app using nodemon
CMD ["node", "/app/server.js"]
