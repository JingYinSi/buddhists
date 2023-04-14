const schedule = require('node-schedule'),
    logger = require('@finelets/hyper-rest/app/Logger'),
    axios = require('axios')

const url = `http://127.0.0.1:9505/job/reset/reports`

const dayJob = schedule.scheduleJob('0,10,20,30,40,50 0,1 0 * * *', async function () {
    logger.info('dayJob 开始执行')
    try {
        await axios.put(url, {'flag': 'day'})
            .then(res => {
                logger.info('job 执行结果:' + res.status)
            })
        logger.info('dayJob 执行成功')
    } catch (e) {
        logger.info('dayJob 执行异常:' + e)
    }
})

const weekJob = schedule.scheduleJob('5,15,25,35,45,55 0,1 0 * * 1', async function () {
    logger.info('weekJob 开始执行')
    try {
        await axios.put(url, {'flag': 'week'})
            .then(res => {
                logger.info('weekJob 执行结果:' + res.status)
            })
        logger.info('weekJob 执行成功')
    } catch (e) {
        logger.info('weekJob 执行异常' + e)
    }
})

const monthJob = schedule.scheduleJob('8,18,28,38,48,58 0,1 0 1 * *', async function () {
    logger.info('job 开始执行')
    try {
        await axios.put(url, {'flag': 'month'})
            .then(res => {
                logger.error('job 执行结果:' + res.status)
            })
        logger.info('job 执行成功')
    } catch (e) {
        logger.info('month 执行异常:' + e)
    }
})