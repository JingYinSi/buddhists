const picGridFs = require('../biz').PicGridFs

module.exports = {
    url: '/wx/api/pictures/:id',
    transitions: {
        UserAvatar: {id: 'context.id'},
        User: {id: 'context'}
    },
    rests: [{
        type: 'http',
        method: 'get',
        handler: (req, res) => {
            const {id} = req.params
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