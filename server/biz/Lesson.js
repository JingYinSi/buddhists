const schema = require('../../db/schema/Lesson'),
	createEntity = require('@finelets/hyper-rest/db/mongoDb/DbEntity')

const config = {
	schema,
	projection: ['name', 'desc'],
	updatables: ['name', 'desc'],
	searchables: ['name', 'desc'],
	listable: ['name']
}

const addIn = {
	apply: async (work) => {
		let lesson = await schema.findById(work.lesson)
		if (!lesson) throw new Error(`The lesson not exists`)
		let row = lesson.applies.push(work)
		if(row == 1) lesson.start = lesson.applies[0].date
		lesson.quantity += work.quantity
		lesson.times += 1
		lesson = await lesson.save()

		lesson = lesson.toJSON()
		return {lesson: lesson.id, ...lesson.applies[row - 1]}
	} 
}

module.exports = createEntity(config, addIn)