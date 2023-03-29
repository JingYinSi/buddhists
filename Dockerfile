FROM node:16

# Provides cached layer for node_modules
ADD package.json /tmp/package.json
RUN cd /tmp && npm install && npm audit fix
RUN mkdir -p /app && cp -a /tmp/node_modules /app/

# Define working directory
WORKDIR /app
ADD . /app

ENV RUNNING_MODE=rest
ENV PORT=9550
ENV MONGODB=mongodb://wxdb:27017/wx
ENV MQ=amqp://jsm:jsm@livingforestmq
ENV JWT_SECRET=MFswDQYJKoZIhvcNAQEBBQADSgAwRwJAamUL/pm3t5EZ

# Expose port
EXPOSE  9550

# Run app using nodemon
CMD ["node", "/app/server.js"]