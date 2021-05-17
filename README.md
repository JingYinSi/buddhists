# Buddhist - 居士林


## VSCode Settings

```
{
    "mochaExplorer.require": "test/testhelper.js",
    "mochaExplorer.files": "test/**/*.js",
    "mochaExplorer.timeout": 1000,
    "mochaExplorer.configFile": "",
    "mochaExplorer.exit": true,
    "editor.fontSize": 15
}

```
## 系统安装
假设安装目录为: /home/jsmtest/apps

Clone cross：

```
git clone -b docker-deploy-test https://github.com/JSMetta/cross.git
cd cross
git pull origin dev

git clone -b vcross-1.0.1 https://github.com/JSMetta/VCross.git
cd VCross
git pull origin vcross-1.0.1

cd ..

docker-compose up --build -d

```
cross项目在/home/jsmtest/apps/cross中


## 常用命令

cd /home/jsmtest/apps/cross
git pull origin docker-deploy-test
docker build -t jsmetta/cross .
docker run -d --name redis -p 6379:6379 redis

docker run --name mongodb --restart unless-stopped -v /home/mongo/data:/data/db -v home/mongo/backups:/backups -d mongo --smallfiles

docker run -d -p 8089:8080 --link redis:redis --name cross jsmetta/cross

#### Ubuntu启动Mongodb

启动：      sudo systemctl start mongod
查看状态：   sudo systemctl status mongod
mongodb客户端： mongo


docker run -it --link mongodb:mongo --rm mongo mongo --host mongo test

docker run -d --name nginx -p 80:80 --link cross:cross cross/nginx

docker-compose up --build

docker exec -it mongodb mongo

#### Remove dangling images
docker images -f dangling=true

docker images purge

#### 备份数据库

脚本文件：/home/mongo/dailybackup.sh

shudo crontab -e

## 开发文档

处理消息时，如果返回：
* Promise.resolve(true) - 接收消息
* Promise.resolve(false) - 拒绝消息，重新进入消息列表
* Promise.reject(err) - 拒绝消息，消息将被废弃

