const { expectation } = require('sinon')
const schema = require('../../db/schema/Lesson'),
	createEntity = require('@finelets/hyper-rest/db/mongoDb/DbEntity')

const config = {
	schema,
	projection: {applies: 0, createdAt: 0, updatedAt: 0, __v: 0},
	updatables: ['code', 'name', 'desc'],
	searchables: ['code', 'name', 'desc'],
	listable: ['code', 'name', 'start', 'times', 'quantity']
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