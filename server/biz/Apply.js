const schema = require('../../db/schema/Apply'),
	createEntity = require('@finelets/hyper-rest/db/mongoDb/DbEntity')

const config = {
	schema,
	projection: ['-createdAt', '-updatedAt', '-__v'],
	listable: ['-createdAt', '-updatedAt', '-__v']
}

const addIn = {
}

module.exports = (msgPublish) => {
	const entity = createEntity(config, addIn)
	entity.apply = (work) => {
		if (!work.quantity) return Promise.resolve()
		return entity.create(work)
			.then(doc => {
				msgPublish(doc)
				return doc
			})
			.catch(e => {
			})
	}
	

	return entity
}