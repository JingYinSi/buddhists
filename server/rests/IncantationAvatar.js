const picGridFs = require('../biz').PicGridFs

module.exports = {
    url: '/pictures/:id',
    transitions: {
        Lesson: {id: 'context'}
    },
    rests: [{
        type: 'http',
        method: 'get',
        handler: (req, res) => {
            const {id} = req.params
            //去掉默认的json头，展示图片
            res.removeHeader('Content-Type')
            const ds = picGridFs.openDownloadStream(id)
            ds.on('data', (data) => {
                res.write(data)
            })
            ds.on('end', () => {
                res.status(200).send()
            })
            ds.on('error', () => {
                res.status(404).end()
            })
        }
    }]
}