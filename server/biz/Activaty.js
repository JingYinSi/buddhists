const schema = require('../../db/schema/Activaty'),
	createEntity = require('@finelets/hyper-rest/db/mongoDb/DbEntity')

const config = {
	schema,
	projection: ['name'],
	updatables: ['name'],
	searchables: ['name'],
	listable: ['name']
}

const addIn = {
}

module.exports = createEntity(config, addIn)