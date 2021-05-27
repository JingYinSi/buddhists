const schema = require('../../db/schema/Activaty'),
	createEntity = require('@finelets/hyper-rest/db/mongoDb/DbEntity'),
	{map, find, pick, omit, extend} = require('underscore')

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

const entity = createEntity(config)

const stageFields = ['id', 'name', 'start', 'end']

const doActivateStage = (stage, date) => {
	if (stage.lessons.length < 1) return false
	stage.start = date
	return true
}

const doCloseStage = (stage, date) => {
	if (!stage.start) return false
	stage.end = date
	return true
}

const addIn = {
	listCurrentStages: () => {
		return schema.find({
			stages:{$elemMatch: {start: {$exists: true}}}
		})
		.then(docs => {
			return map(docs, doc => {
				doc = doc.toJSON()
				const stage = find(doc.stages, s => {
					return s.start
				})
				return omit({activaty: doc.id, activatyName: doc.name, stage: stage.id, stageName: stage.name}, (val, key) => {
					return key == 'stageName' && !val
				})
			})
		})
	},

	activateStage: (stageId, activate=true, date=new Date()) => {
		let stageDoc
		return schema.findOne({
			stages: {	
				$elemMatch: {_id: stageId}
			}
		})
		.then(activaty => {
			if (!activaty) return
			stageDoc = activaty.stages.id(stageId)
			const success = activate ? doActivateStage(stageDoc, date) : doCloseStage(stageDoc, date)
			if (!success) return
			stageDoc = stageDoc.toJSON()
			return activaty.save()
				.then(() => {
					return pick(stageDoc, stageFields)
				})
		})
		.catch((e) => {
		})
	},

	withApply: (work) => {
		let activaty, stage, lesson
		return entity.findBySubDocId(work.lesson, 'stages.lessons')
			.then(doc => {
				activaty = doc
				stage = find(doc.stages, s => {
					lesson = s.lessons.id(work.lesson)
					return lesson
				})
				lesson.start = lesson.start || work.date
				lesson.quantity += work.quantity
				lesson.times += 1
				return activaty.save() 
			})
			.then(() => {
				return true
			})
	}
}


module.exports = extend(entity, addIn)