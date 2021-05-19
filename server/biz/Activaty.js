const schema = require('../../db/schema/Activaty'),
	createEntity = require('@finelets/hyper-rest/db/mongoDb/DbEntity'),
	{pick, map} = require('underscore')

const config = {
	schema,
	projection: ['name'],
	updatables: ['name'],
	searchables: ['name'],
	listable: ['name']
}

const addIn = {
	listStages: (activatyId) => {
		return schema.findById(activatyId)
			.then(doc => {
				return map(doc.stages, stage => {
					stage = stage.toJSON()
					return pick(stage, 'id', 'name')
				})
			})
	},
	createStage: (activatyId, data) => {
		let row
		return schema.findById(activatyId)
			.then(doc => {
				row = doc.stages.push(data)
				return doc.save()
			})
			.then(doc => {
				stage = pick(doc.stages[row - 1].toJSON(), 'id', 'name')
				return {activaty: activatyId, ...stage}
			})
	}
}

module.exports = createEntity(config, addIn)