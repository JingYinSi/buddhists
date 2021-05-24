const schema = require('../../db/schema/Activaty'),
	createEntity = require('@finelets/hyper-rest/db/mongoDb/DbEntity')

const config = {
	schema,
	projection: ['-stages'],
	updatables: ['name'],
	searchables: ['name'],
	listable: ['name'],
	/* subdoc: {
		projection: {
			stages: ['name']
		}
	} */
}

const addIn = {
}

module.exports = createEntity(config, addIn)