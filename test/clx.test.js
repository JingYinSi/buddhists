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
			let doc
			return dbSave(schema, {name})
				.then((data) => {
					doc = data
					return testTarget.findById(data.id)
				})
				.then(data => {
					expect(data).eqls({id: data.id, name, createdAt: doc.createdAt, updatedAt: doc.updatedAt, __v: doc.__v})
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
			let activatyId, subdocPath, activatyDoc
			const stage = 'stage'
			beforeEach(() => {
				subdocPath = 'stages'
				return dbSave(schema, {name})
					.then(doc => {
						activatyId = doc.id
						activatyDoc = doc
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
						return testTarget.listSubs(doc.id, subdocPath)
					})
					.then(list => {
						expect(list).eqls([{id: stages[0].id}, {id: stages[1].id, name: stage}])
					})
			})

			describe('新增活动阶段', () => {
				it('活动不存在', () => {
					return testTarget.createSubDoc(ID_NOT_EXIST, subdocPath, {})
						.should.be.rejectedWith()
				})

				it('创建最简单的活动阶段', () => {
					return testTarget.createSubDoc(activatyId, subdocPath, {})
						.then(doc => {
							expect(doc).eql({id: doc.id})
						})
				})

				it('成功创建活动阶段', () => {
					return testTarget.createSubDoc(activatyId, subdocPath, {name: stage})
						.then(doc => {
							expect(doc).eql({id: doc.id, name: stage})
						})
				})
			})

			describe('Activaty.Stage.Lesson - 活动阶段功课', () => {
				const lessonSchema = require('../db/schema/Lesson'),
				start = new Date().toJSON()
				let lessonInDb, stageId, lessonId

				beforeEach(() => {
					subdocPath = 'stages.lessons'
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
							activatyDoc = doc.toJSON()
							stageId = doc.stages[0].id
							lessonId = doc.stages[0].lessons[0].id
						})
				})
				
				it('创建指定活动阶段的功课', () => {
					lessonRef = lessonInDb[1].id
					let newLessonId
					return testTarget.createSubDoc(stageId, subdocPath, {lesson: lessonRef})
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
							return testTarget.listSubs(stageId, subdocPath)
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
					return testTarget.findSubDocById(lessonId, subdocPath)
						.then(doc => {
							expect(doc).eql(
								{Activaty: activatyId, stages: stageId, id: doc.id, lesson: lessonInDb[0].id,
									 start, times: 0, quantity: 0, __v: activatyDoc.__v, updatedAt: activatyDoc.updatedAt}
							)
						})
				})

				it('删除指定活动阶段功课', () => {
					return testTarget.removeSubDoc(lessonId, subdocPath)
						.then(() => {
							return schema.findById(activatyId)
						})
						.then(doc => {
							expect(doc.stages[0].lessons.length).eql(0)
						})
				})

				it('删除不存在的功课', () => {
					return testTarget.removeSubDoc(ID_NOT_EXIST, subdocPath)
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
	})

	describe('交易', () => {
		const dbschema = require('../db/schema'),
			activatyEntity = require('../server/biz/Activaty')
		let lessonsInDb, activatiesInDb
		let stageDate

		beforeEach(() => {
			stageDate = new Date().toJSON()
			return clearDB()
				.then(() => {
					return dbschema.lessons.insertMany([{name: 'foo'}, {name: 'fee'}, {name: 'fuu'}])
				})
				.then(docs => {
					lessonsInDb = map(docs, doc => {
						return doc.toJSON()
					})
				})
		})

		describe('活动阶段', () => {
			beforeEach(() => {
				return dbschema.activaties.insertMany([
						{
							name: 'activaty1', stages: [
								{name: 'stage1', lessons: [{lesson: lessonsInDb[0].id}, {lesson: lessonsInDb[1].id}]},
								{name: 'stage2', lessons: [{lesson: lessonsInDb[1].id}]},
								{name: 'stage3'}
							]
						},
						{
							name: 'activaty2', stages: [
								{name: 'stage1', lessons: [{lesson: lessonsInDb[1].id}]},
								{name: 'stage2', start: stageDate, lessons: [{lesson: lessonsInDb[0].id}, {lesson: lessonsInDb[1].id}]}
							]
						},
						{
							name: 'activaty3', stages: [
								{start: stageDate, end: new Date().toJSON(), lessons: [{lesson: lessonsInDb[1].id}]},
								{name: 'stage2'}
							]
						},
						{
							name: 'activaty4', stages: [
								{start: stageDate, lessons: [{lesson: lessonsInDb[1].id}]},
								{start: stageDate, end: new Date().toJSON(), lessons: [{lesson: lessonsInDb[1].id}]},
								{name: 'stage2'}
							]
						}
					])
					.then(docs => {
						activatiesInDb = map(docs, doc => {
							return doc.toJSON()
						})
					})
			})

			it('列出所有当前正在开展的活动阶段', () => {
				return activatyEntity.listCurrentStages()
					.then(docs => {
						expect(docs).eql([
							{activaty: activatiesInDb[1].id, activatyName: 'activaty2', stage: activatiesInDb[1].stages[1].id, stageName: 'stage2'},
							{activaty: activatiesInDb[3].id, activatyName: 'activaty4', stage: activatiesInDb[3].stages[0].id}
						])
					})
			})

			describe('开展活动', () => {
				it('指定活动阶段不合法', () => {
					return activatyEntity.activateStage('abc')
						.then(doc => {
							expect(doc).undefined
						})
				})
	
				it('指定活动阶段不存在', () => {
					return activatyEntity.activateStage(ID_NOT_EXIST)
						.then(doc => {
							expect(doc).undefined
						})
				})
	
				it('指定活动阶段无任何课程', () => {
					return activatyEntity.activateStage(activatiesInDb[2].stages[1].id)
						.then(doc => {
							expect(doc).false
						})
				})
	
				it('正常开展', () => {
					return activatyEntity.activateStage(activatiesInDb[0].stages[1].id)
						.then(doc => {
							expect(doc).eql({
								id: activatiesInDb[0].stages[1].id,
								name: activatiesInDb[0].stages[1].name,
								start: doc.start
							})
						})
				})
	
				it('可以指定活动开展日期', () => {
					return activatyEntity.activateStage(activatiesInDb[0].stages[1].id, true, stageDate)
						.then(doc => {
							expect(doc).eql({
								id: activatiesInDb[0].stages[1].id,
								name: activatiesInDb[0].stages[1].name,
								start: stageDate
							})
						})
				})
	
				it('正常开展 - 指定的活动阶段已开展', () => {
					const anotherStart = new Date()
					return activatyEntity.activateStage(activatiesInDb[1].stages[1].id, true, anotherStart)
						.then(doc => {
							expect(doc).eql({
								id: activatiesInDb[1].stages[1].id,
								name: activatiesInDb[0].stages[1].name,
								start: anotherStart.toJSON()
							})
						})
				})

				it('重新开展已结束的活动阶段', () => {
					const antherStart = new Date()
					return activatyEntity.activateStage(activatiesInDb[2].stages[0].id, true, antherStart)
						.then(doc => {
							expect(doc).eql({
								id: activatiesInDb[2].stages[0].id,
								start: antherStart.toJSON()
							})
						})
				})

				it('重新开展已结束的活动阶段, 但因本活动已有阶段正在开展， 故拒绝', () => {
					const antherStart = new Date()
					return activatyEntity.activateStage(activatiesInDb[3].stages[1].id)
						.then(doc => {
							expect(doc).false
						})
				})
			})

			describe('处理修量', () => {
				const id ='5ce79b99da3537277c3f9988',
					date = new Date().toJSON(),
					quantity = 1000,
					creator = '5ce79b99da3537277c3f9923'
					
				let work, lesson

				beforeEach(() => {
					lesson = activatiesInDb[0].stages[0].lessons[1].id
					work = {id, date, lesson, quantity, creator}
				})

				it('正确处理', () => {
					return activatyEntity.withApply(work)   // The first time
						.then(data => {
							expect(data).true
							return dbschema.activaties.findById(activatiesInDb[0].id)
						})
						.then(doc => {
							doc = doc.toJSON()
							expect(doc.stages[0].lessons[1]).eql({...doc.stages[0].lessons[1], 
								start: date, quantity, times: 1})

							// withApply for 2th time
							const anotherDate = new Date().toJSON()
							return activatyEntity.withApply({...work, date: anotherDate})
						})
						.then(data => {
							expect(data).true
							return dbschema.activaties.findById(activatiesInDb[0].id)
						})
						.then(doc => {
							doc = doc.toJSON()
							expect(doc.stages[0].lessons[1]).eql({...doc.stages[0].lessons[1], 
								start: date, quantity: 2000, times: 2})
						})
				})
			})

			describe('关闭活动', () => {
				it('指定活动阶段尚未开展', () => {
					return activatyEntity.activateStage(activatiesInDb[0].stages[0].id, false)
						.then(doc => {
							expect(doc).false
						})
				})
	
				it('正常关闭活动阶段', () => {
					return activatyEntity.activateStage(activatiesInDb[1].stages[1].id, false)
						.then(doc => {
							expect(doc.end).not.eql(stageDate)
							expect(doc).eql({
								id: activatiesInDb[1].stages[1].id,
								name: 'stage2',
								start: stageDate,
								end: doc.end
							})
						})
				})
	
				it('可以指定活动关闭日期', () => {
					return activatyEntity.activateStage(activatiesInDb[1].stages[1].id, false, stageDate)
						.then(doc => {
							expect(doc).eql({
								id: activatiesInDb[1].stages[1].id,
								name: 'stage2',
								start: stageDate,
								end: stageDate
							})
						})
				})
			})
		})

		describe('报修量', () => {
			const date = new Date().toJSON()
			let msgPublish, quantity, lesson, creator

			beforeEach(() => {
				quantity = 1000
				creator = '5ce79b99da3537277c3f7788'
				msgPublish = sinon.spy()
				testTarget = require('../server/biz/Apply')(msgPublish)
				return dbschema.activaties.insertMany([
						{name: 'activaty1', stages: [
							{name: 'stage1', start: stageDate, lessons: [{lesson: lessonsInDb[0].id}, {lesson: lessonsInDb[1].id}]},
							{name: 'stage2'}
						]}
					])
					.then(docs => {
						activatiesInDb = map(docs, doc => {
							return doc.toJSON()
						})
						lesson = docs[0].stages[0].lessons[0].id
					})
			})

			it('课程非法', async () => {
				lesson = 'abc'
				return testTarget.apply({date, lesson, quantity, creator})
					.then(doc => {
						expect(doc).undefined
						assert(msgPublish.notCalled)
						return dbschema.applies.count()
							.then(data => {
								expect(data).eql(0)
							})
					})
			})

			it('申报人非法', async () => {
				creator = 'abc'
				return testTarget.apply({date, lesson, quantity, creator})
					.then(doc => {
						expect(doc).undefined
						assert(msgPublish.notCalled)
						return dbschema.applies.count()
							.then(data => {
								expect(data).eql(0)
							})
					})
			})

			it('未报数量则被忽略', async () => {
				return testTarget.apply({date, lesson: activatiesInDb[0].stages[0].lessons[0].id, creator})
					.then(doc => {
						expect(doc).undefined
						assert(msgPublish.notCalled)
						return dbschema.applies.count()
							.then(data => {
								expect(data).eql(0)
							})
					})
			})

			it('数量为0则被忽略', async () => {
				quantity = 0
				return testTarget.apply({date, lesson: activatiesInDb[0].stages[0].lessons[0].id, quantity, creator})
					.then(doc => {
						expect(doc).undefined
						assert(msgPublish.notCalled)
						return dbschema.applies.count()
							.then(data => {
								expect(data).eql(0)
							})
					})
			})

			it('未指定申报人则被忽略', async () => {
				quantity = 0
				return testTarget.apply({date, lesson: activatiesInDb[0].stages[0].lessons[0].id, quantity})
					.then(doc => {
						expect(doc).undefined
						assert(msgPublish.notCalled)
						return dbschema.applies.count()
							.then(data => {
								expect(data).eql(0)
							})
					})
			})

			it('可缺省日期', async () => {
				return testTarget.apply({lesson: activatiesInDb[0].stages[0].lessons[0].id, quantity, creator})
					.then(doc => {
						const expectedDoc = {
							id: doc.id, date: doc.date, lesson: activatiesInDb[0].stages[0].lessons[0].id, quantity, creator
						}
						expect(doc).eql(expectedDoc)
						assert(msgPublish.withArgs(expectedDoc).calledOnce);
					})
			})

			it('申报修量', async () => {
				return testTarget.apply({date, lesson: activatiesInDb[0].stages[0].lessons[0].id, quantity, creator})
					.then(doc => {
						const expectedDoc = {
							id: doc.id, date, lesson: activatiesInDb[0].stages[0].lessons[0].id, quantity, creator
						}
						expect(doc).eql(expectedDoc)
						assert(msgPublish.withArgs(expectedDoc).calledOnce);
					})
			})


		})
	})
})