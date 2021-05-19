const { expect } = require('chai')

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

		it('加载 - 字段包括id,name', () => {
			start = new Date()
			return dbSave(schema, {name})
				.then((data) => {
					return testTarget.findById(data.id)
				})
				.then(data => {
					expect(data).eqls({id: data.id, name})
				})
		})

		describe('创建', () => {
			it('名称非空', () => {
				return testTarget.create({})
					.should.be.rejectedWith()
			})

			it('名称必须唯一', () => {
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

		it('更新 - only name is updateable', () => {	
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

		describe('阶段', () => {
			let activatyId
			const stage = 'stage'
			beforeEach(() => {
				return dbSave(schema, {name})
					.then(doc => {
						activatyId = doc.id
					})
			})

			it('列表', () => {
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

			describe('新增', () => {
				it('活动不存在', () => {
					return testTarget.createStage(ID_NOT_EXIST, {})
						.should.be.rejectedWith()
				})

				it('最简单', () => {
					return testTarget.createStage(activatyId, {})
						.then(doc => {
							expect(doc).eql({activaty: activatyId, id: doc.id})
						})
				})

				it('成功', () => {
					return testTarget.createStage(activatyId, {name: stage})
						.then(doc => {
							expect(doc).eql({activaty: activatyId, id: doc.id, name: stage})
						})
				})
			})
		})
	})
	describe('Lessons - 功课', () => {
		const name = 'foo',
			code = 'code',
			desc = 'desc'
			
		beforeEach(() => {
			toCreate = {
				code, name
			};
			schema = require('../db/schema/Lesson');
			testTarget = require('../server/biz/Lesson');
		});

		it('加载 - 字段包括id,code,name,desc,start,times,quantity', () => {
			start = new Date()
			return dbSave(schema, {code: 'foo', name: '001', desc: 'desc1oo', start})
				.then((data) => {
					return testTarget.findById(data.id)
				})
				.then(data => {
					expect(data).eqls({id: data.id, code: 'foo', name: '001', desc: 'desc1oo', start: start.toJSON(), times: 0, quantity: 0})
				})
		})

		describe('搜索', () => {
			it('搜索 - 字段包括code,name,desc', () => {
				data = [
					{code: 'fee', name: '001'},
					{code: 'foo', name: '002'},
					{code: 'fuu', name: 'foo'},
					{desc: 'desc1oo', code: 'fff', name: '003'}
				]
				return schema.insertMany(data)
					.then(() => {
						return testTarget.search({}, 'oo')
					})
					.then(data => {
						expect(data.length).eqls(3)
					})
			})
	
			it('搜索 - 字段包括id,code,name,times,quantity', () => {
				return dbSave(schema, {code: 'foo', name: '001', desc: 'desc1oo'})
					.then(() => {
						return testTarget.search({}, 'oo')
					})
					.then(data => {
						doc = data[0]
						expect(doc).eqls({id: doc.id, code: 'foo', name: '001', times: 0, quantity: 0})
					})
			})
		})

		describe('创建', () => {
			it('名称非空', () => {
				return dbSave(schema, {code})
					.should.be.rejectedWith()
			})

			it('名称必须唯一', () => {
				return dbSave(schema, toCreate)
					.then(() => {
						return testTarget.create({name, code: 'another code'})
					})
					.should.be.rejectedWith()
			})

			it('编号非空', () => {
				return dbSave(schema, {name})
					.should.be.rejectedWith()
			})

			it('编号必须唯一', () => {
				return dbSave(schema, toCreate)
					.then(() => {
						return testTarget.create({name: 'anothername', code})
					})
					.should.be.rejectedWith()
			})

			it('创建功课', () => {
				return testTarget.create({...toCreate, desc})
					.then(doc => {
						return schema.findById(doc.id)
					})
					.then(doc => {
						doc = doc.toJSON()
						expect(doc.code).eql(code)
						expect(doc.name).eql(name)
						expect(doc.desc).eql(desc)
						expect(doc.applies.length).eql(0)
						expect(doc.start).undefined
						expect(doc.times).eql(0)
						expect(doc.quantity).eql(0)
					})
			})
		})

		it('更新 - code name desc are updateable', () => {				
			return dbSave(schema, {code: 'v1', name: 'v2', desc: 'v3'})
				.then(doc => {
					id = doc.id
					__v = doc.__v
					return testTarget.update({id, __v, code, name, desc})
				})
				.then(doc => {
					expect(doc.code).eql(code)
					expect(doc.name).eql(name)
					expect(doc.desc).eql(desc)
				})
		})

		describe('报修量', () => {
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