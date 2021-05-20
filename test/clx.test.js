const { expect } = require('chai'),
{pick, map} = require('underscore')

describe('LivingForest', () => {
	const ID_NOT_EXIST = '5ce79b99da3537277c3f3b66'
	let schema, testTarget, toCreate;
	let id, __v;

	beforeEach(function () {
		__v = 0
		return clearDB();
	});

	afterEach(function () {
		return clearDB();
	});

	describe('Activaties - 活动', () => {
		const name = 'foo'
			
		beforeEach(() => {
			schema = require('../db/schema/Activaty');
			testTarget = require('../server/biz/Activaty');
		});

		it('加载活动 - 字段包括id,name', () => {
			start = new Date()
			return dbSave(schema, {name})
				.then((data) => {
					return testTarget.findById(data.id)
				})
				.then(data => {
					expect(data).eqls({id: data.id, name})
				})
		})

		describe('创建活动', () => {
			it('活动名称非空', () => {
				return testTarget.create({})
					.should.be.rejectedWith()
			})

			it('活动名称必须唯一', () => {
				return testTarget.create({name})
					.then(() => {
						return testTarget.create({name})
					})
					.should.be.rejectedWith()
			})

			it('创建活动', () => {
				return testTarget.create({name})
					.then(doc => {
						return schema.findById(doc.id)
					})
					.then(doc => {
						doc = doc.toJSON()
						expect(doc.name).eql(name)
						expect(doc.stages.length).eql(0)
					})
			})
		})

		it('更新活动 - only name is updateable', () => {	
			newName = 'ffff'			
			return dbSave(schema, {name})
				.then(doc => {
					id = doc.id
					__v = doc.__v
					expect(doc.name).eql(name)
					return testTarget.update({id, __v, name: newName})
				})
				.then(doc => {
					expect(doc.name).eql(newName)
				})
		})

		describe('Activaty.Stage - 活动阶段', () => {
			let activatyId
			const stage = 'stage'
			beforeEach(() => {
				return dbSave(schema, {name})
					.then(doc => {
						activatyId = doc.id
					})
			})

			it('活动阶段列表', () => {
				stages = [{},  {name: stage}]
				return schema.findById(activatyId)
					.then(doc => {
						doc.stages.push(stages[0])
						doc.stages.push(stages[1])
						return doc.save()
					})
					.then((doc) => {
						stages = doc.stages
						return testTarget.listStages(doc.id)
					})
					.then(list => {
						expect(list).eqls([{id: stages[0].id}, {id: stages[1].id, name: stage}])
					})
			})

			describe('新增活动阶段', () => {
				it('活动不存在', () => {
					return testTarget.createStage(ID_NOT_EXIST, {})
						.should.be.rejectedWith()
				})

				it('创建最简单的活动阶段', () => {
					return testTarget.createStage(activatyId, {})
						.then(doc => {
							expect(doc).eql({activaty: activatyId, id: doc.id})
						})
				})

				it('成功创建活动阶段', () => {
					return testTarget.createStage(activatyId, {name: stage})
						.then(doc => {
							expect(doc).eql({activaty: activatyId, id: doc.id, name: stage})
						})
				})
			})

			describe('Activaty.Stage.Lesson - 活动阶段功课', () => {
				const lessonSchema = require('../db/schema/Lesson'),
				start = new Date().toJSON()
				let lessonInDb, stageId, lessonId

				beforeEach(() => {
					return lessonSchema.insertMany([{name: 'foo'}, {name: 'fee'}, {name: 'fuu'}])
						.then(docs => {
							lessonInDb = docs
							return schema.findById(activatyId)
						})
						.then(doc => {
							doc.stages.push({name: stage, lessons: [{lesson: lessonInDb[0].id, start}]})
							return doc.save()
						})
						.then(doc => {
							stageId = doc.stages[0].id
							lessonId = doc.stages[0].lessons[0].id
						})
				})
				
				it('创建指定活动阶段的功课', () => {
					lessonRef = lessonInDb[1].id
					let newLessonId
					return testTarget.createLesson(stageId, {lesson: lessonRef})
						.then(doc => {
							newLessonId = doc.id
							return schema.findById(activatyId)
						})
						.then(doc => {
							doc = doc.toJSON()
							expect(doc.stages[0].lessons).eql([
								{id: lessonId, lesson: lessonInDb[0].id, start, times: 0, quantity: 0},
								{id: newLessonId, lesson: lessonRef, times: 0, quantity: 0},
							])
						})
				})

				it('列出指定活动阶段的所有功课', () => {
					return schema.findById(activatyId)
						.then(doc => {
							doc.stages[0].lessons.push({lesson: lessonInDb[2].id, start})
							doc.stages[0].lessons.push({lesson: lessonInDb[1].id})
							return doc.save()
						})
						.then(() => {
							return testTarget.listLessons(stageId)
						})
						.then(docs => {
							expect(docs).eql([
								{id: docs[0].id, lesson: lessonInDb[0].id, start, times: 0, quantity: 0},
								{id: docs[1].id, lesson: lessonInDb[2].id, start, times: 0, quantity: 0},
								{id: docs[2].id, lesson: lessonInDb[1].id, times: 0, quantity: 0}
							])
						})
				})
				
				it('加载指定的活动阶段功课', () => {
					return testTarget.loadLesson(lessonId)
						.then(doc => {
							expect(doc).eql(
								{id: doc.id, lesson: lessonInDb[0].id, start, times: 0, quantity: 0}
							)
						})
				})

				it('删除指定活动阶段功课', () => {
					return testTarget.deleteLesson(lessonId)
						.then(() => {
							return schema.findById(activatyId)
						})
						.then(doc => {
							expect(doc.stages[0].lessons.length).eql(0)
						})
				})

				it('删除不存在的功课', () => {
					return testTarget.deleteLesson(ID_NOT_EXIST)
						.then(() => {
							return schema.findById(activatyId)
						})
						.then(doc => {
							expect(doc.stages[0].lessons.length).eql(1)
						})
				})
			})
		})
	})
	describe('Lessons - 功课', () => {
		const name = 'foo',
			desc = 'desc'
			
		beforeEach(() => {
			toCreate = {
				name
			};
			schema = require('../db/schema/Lesson');
			testTarget = require('../server/biz/Lesson');
		});

		it('加载 - 字段包括id,name,desc', () => {
			start = new Date()
			return dbSave(schema, {name: '001', desc: 'desc1oo'})
				.then((data) => {
					return testTarget.findById(data.id)
				})
				.then(data => {
					expect(data).eqls({id: data.id, name: '001', desc: 'desc1oo'})
				})
		})

		describe('搜索', () => {
			it('搜索 - 字段包括name,desc', () => {
				data = [
					{name: '002'},
					{name: 'foo'},
					{desc: 'desc1oo', name: '003'}
				]
				return schema.insertMany(data)
					.then(() => {
						return testTarget.search({}, 'oo')
					})
					.then(data => {
						expect(data.length).eqls(2)
					})
			})
	
			it('搜索 - 字段包括id,name', () => {
				return dbSave(schema, {name: '001', desc: 'desc1oo'})
					.then(() => {
						return testTarget.search({}, 'oo')
					})
					.then(data => {
						doc = data[0]
						expect(doc).eqls({id: doc.id, name: '001'})
					})
			})
		})

		describe('创建', () => {
			it('名称非空', () => {
				return dbSave(schema, {})
					.should.be.rejectedWith()
			})

			it('名称必须唯一', () => {
				return dbSave(schema, toCreate)
					.then(() => {
						return testTarget.create({name, code: 'another code'})
					})
					.should.be.rejectedWith()
			})

			it('创建功课', () => {
				return testTarget.create({name, desc})
					.then(doc => {
						return schema.findById(doc.id)
					})
					.then(doc => {
						doc = doc.toJSON()
						expect(doc.name).eql(name)
						expect(doc.desc).eql(desc)
					})
			})
		})

		it('更新 - name desc are updateable', () => {				
			return dbSave(schema, {name: 'v2', desc: 'v3'})
				.then(doc => {
					id = doc.id
					__v = doc.__v
					return testTarget.update({id, __v, name, desc})
				})
				.then(doc => {
					expect(doc.name).eql(name)
					expect(doc.desc).eql(desc)
				})
		})

		xdescribe('报修量', () => {
			const quantity = 1000,
				creator = ID_NOT_EXIST

			let lessonDoc, lesson, workDoc

			beforeEach(() => {
				return dbSave(schema, toCreate)
					.then(doc => {
						lessonDoc = doc
						lesson = doc.id
					})
			})

			it('功课不存在', async () => {
				lesson = ID_NOT_EXIST
				work = {lesson}
				await expect(testTarget.apply(work)).to.be.rejectedWith()
			})

			it('申报成功', async () => {
				work = {lesson, quantity, creator}
				workDoc1 = await testTarget.apply(work)
				workDoc2 = await testTarget.apply(work)
				doc = await schema.findById(lesson)
				doc = doc.toJSON()
				expect(doc.start).eql(workDoc1.date)
				expect(doc.quantity).eql(quantity * 2)
				expect(doc.applies.length).eql(2)
				expect(doc.applies[0]).eql({id: workDoc1.id, quantity, creator, date: workDoc1.date})
				expect(doc.applies[1]).eql({id: workDoc2.id, quantity, creator, date: workDoc2.date})
			})


		})
	})
})