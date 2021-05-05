const schema = require('../../db/schema/Lesson'),
	createEntity = require('@finelets/hyper-rest/db/mongoDb/DbEntity')

const config = {
	schema,
	updatables: ['code', 'name', 'desc'],
	searchables: ['code', 'name', 'desc']
}

const addIn = {
}

module.exports = createEntity(config, addIn)