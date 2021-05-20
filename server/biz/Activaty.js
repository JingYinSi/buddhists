const schema = require('../../db/schema/Activaty'),
	createEntity = require('@finelets/hyper-rest/db/mongoDb/DbEntity'),
	{pick, map, findIndex} = require('underscore')

const config = {
	schema,
	projection: ['name'],
	updatables: ['name'],
	searchables: ['name'],
	listable: ['name']
}

const genWhere = (subDocId, paths) => {
	let whereClouse
	for(i=0;i<paths.length;i++) {
		if (i == 0) {
			whereClouse = {}
			whereClouse[paths[paths.length -i -1]] = {
					$elemMatch: {_id: subDocId} 
				}
		} else {
			up = {}
			up[paths[paths.length -i -1]] = {
				$elemMatch: whereClouse
			}
			whereClouse = up
		}
	}
	return whereClouse

}

const findSubDocumentFromParent = (doc, subDocId, paths) => {
	let indexes = [paths.length]
	__findIndex = (subDoc, from) => {
		indexes[from] = findIndex(subDoc[paths[from]], el => {
			if (from + 1 == paths.length) {
				e = el._id == subDocId 
				return e
			}
			__findIndex(el, from + 1)
			e = indexes[from + 1] >= 0
			return e
		})
	}
	__findIndex(doc, 0)
	
	__getSub = (doc, lev) => {
		sd = doc[paths[lev]][indexes[lev]]
		if (lev == paths.length - 1) return sd
		return __getSub(sd, lev + 1)
	}
	return __getSub(doc, 0)
}

const findSubDocumentById = (schema, subDocId, paths) => {
	wh = genWhere(subDocId, paths)
	return schema.findOne(wh)
		.then(doc => {
			if (!doc) return
			return findSubDocumentFromParent(doc, subDocId, paths)
		})
}

const deleteSubDocumentById = (schema, subDocId, paths) => {
	wh = genWhere(subDocId, paths)
	return schema.findOne(wh)
		.then(parent => {
			if (!parent) return
			doc = findSubDocumentFromParent(parent, subDocId, paths)
			doc.remove()
			return parent.save()
		})
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
	},
	createLesson: (stageId, data) => {
		let row, activatyId, stageIndex
		return schema.findOne({
			stages: {
				$elemMatch: {_id: stageId} 
			}
		})
		.then(doc => {
			activatyId = doc.id
			stageIndex = findIndex(doc.stages, s => {
				return s._id == stageId
			})
			row = doc.stages[stageIndex].lessons.push(data)
			return doc.save()
		})
		.then(doc => {
			doc = doc.toJSON()
			lesson = doc.stages[stageIndex].lessons[row - 1]
			return {
				activaty: activatyId,
				stage: stageId,
				...lesson
			}
		})
	},
	listLessons: (stageId) => {
		return schema.findOne({
			stages: {
				$elemMatch: {_id: stageId} 
			}
		})
		.then(doc => {
			stageIndex = findIndex(doc.stages, s => {
				return s._id == stageId
			})
			doc = doc.toJSON()
			return doc.stages[stageIndex].lessons
		})
	},
	loadLesson: (lessonId) => {
		return findSubDocumentById(schema, lessonId, ['stages', 'lessons'])
			.then(doc => {
				return doc.toJSON()
			})
	},
	deleteLesson: (lessonId) => {
		return deleteSubDocumentById(schema, lessonId, ['stages', 'lessons'])
	}
}

module.exports = createEntity(config, addIn)