const schema = require('../../../db/schema/mygdh/Lesson'),
    createEntity = require('@finelets/hyper-rest/db/mongoDb/DbEntity'),
    subDocPath = 'instances',
    reportEntity = require('./Report'),
    moment = require('moment'),
    {extend} = require('underscore'),
    mqPublish = require('@finelets/hyper-rest/mq'),
    {promise} = require("sinon"),
    _ = require("lodash");

const config = {
    schema,
    projection: ['name', 'title', 'pic', 'icon', 'incantation', 'sortNo', 'desc'],
    updatables: ['name', 'title', 'pic', 'icon', 'incantation', 'sortNo', 'desc'],
    searchables: ['name', 'title', 'desc'],
    listable: ['name'],
    sort: {'sortNo': 1}
}

const entity = createEntity(config)
const addIn = {
    updatePic: (id, pic) => {
        let oldPic

        return schema.findById(id)
            .then(doc => {
                oldPic = doc.pic
                doc.pic = pic
                return doc.save()
            })
            .then(() => {
                if (oldPic) {
                    mqPublish['removePic'](oldPic)
                }
            })
    },
    updateIcon: (id, icon) => {
        let oldIcon

        return schema.findById(id)
            .then(doc => {
                oldIcon = doc.icon
                doc.icon = icon
                return doc.save()
            })
            .then(() => {
                if (oldIcon) {
                    mqPublish['removePic'](oldIcon)
                }
            })
    },
    updateIncantation: (id, pic) => {
        let oldPic

        return schema.findById(id)
            .then(doc => {
                oldPic = doc.pic
                doc.incantation = pic
                return doc.save()
            })
            .then(() => {
                if (oldPic) {
                    mqPublish['removePic'](oldPic)
                }
            })
    },
    updateLessonInstance: (msg) => {
        return entity.findSubDocById(msg.lessonIns, subDocPath).then(doc => {
            if (doc && msg.times >= 1) {
                let condi = {'user': msg.user, 'lessonIns': msg.lessonIns}
                let text
                return reportEntity.search(condi, text)
                    .then(function (list) {
                        // 用户第一次报功课，总报数人数+1；第二次报功课时不再增加报数人数
                        let reportPopulations = 1
                        if (list.length >= 2) {
                            reportPopulations = 0
                        }

                        let reportDate = moment().format('yyyyMMDD')
                        condi = {'user': msg.user, 'reportDate': reportDate, 'lessonIns': msg.lessonIns}
                        return reportEntity.search(condi, text)
                            .then(function (todayList) {
                                //用户 当天第一次报功课，今日报数人数+1；第二次报功课后不再增加人数
                                let todayReportPopulations = 1
                                if (todayList.length >= 2) {
                                    todayReportPopulations = 0
                                }
                                if (!doc.times) doc.times = 0

                                doc.toUpdate = {
                                    populations: doc.populations + reportPopulations,
                                    times: doc.times + msg.times,
                                    todayPopulations: doc.todayPopulations + todayReportPopulations,
                                    todayTimes: doc.todayTimes + msg.times
                                }
                                return entity.updateSubDoc(subDocPath, doc)
                            })

                    })
            }
        }).catch(e => {
            if (e.name === 'CastError') return false
            throw e
        })
    },
    resetLessonIns: (jobParam) => {
        return schema.find().then((list) => {
            list.forEach(item => {
                entity.listSubs(item.id, subDocPath).then(lessonIns => {
                    if (lessonIns.length > 0) {
                        // 行子文档所有subid
                        let lessonInsItemIds = []
                        let lessonInsItemLast
                        lessonIns.forEach(lessonInsItem => {
                            lessonInsItemIds.push(lessonInsItem.id)
                            lessonInsItemLast = lessonInsItem
                        })
                        if (lessonInsItemLast) {
                            lessonInsItemLast.toUpdate = {
                                todayPopulations: 0,
                                todayTimes: 0
                            }
                            return entity.updateManySubDoc(subDocPath, lessonInsItemLast, lessonInsItemIds)
                        }
                    }
                })
            })
        })
            .catch(e => {
                if (e.name === 'CastError') return false
                throw e
            })
    },
    findLessonInstance: (instanceId) => {
        return entity.findSubDocById(instanceId, subDocPath).then(function (lessonInstance) {
            if (lessonInstance) {
                lessonInstance.hasTarget = function () {
                    return this.target && this.target > 0
                }

                lessonInstance.calculateTargetDays = function (totalTimes) {
                    return Math.ceil(totalTimes / this.target)
                }
            }

            const promise = new Promise((resolve, reject) => {
                resolve(lessonInstance)
            });
            return promise;
        });
    }
}

module.exports = extend(entity, addIn)