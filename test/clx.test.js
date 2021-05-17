
describe('LivingForest', () => {
	const ID_NOT_EXIST = '5ce79b99da3537277c3f3b66'
	let schema, testTarget, toCreate;
	let id, __v;

	beforeEach(function () {
		__v = 0
		return clearDB();
	});

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

		it('搜索 - 字段包括code,name,desc', () => {
			let records = []
			records.push(dbSave(schema, {code: 'fee', name: '001'}))
			records.push(dbSave(schema, {code: 'foo', name: '002'}))
			records.push(dbSave(schema, {code: 'fuu', name: 'foo'}))
			records.push(dbSave(schema, {desc: 'desc1oo', code: 'fff', name: '003'}))
			return Promise.all(records)
				.then(() => {
					return testTarget.search({}, 'oo')
				})
				.then(data => {
					expect(data.length).eqls(3)
				})
				.catch(e => {
					throw e
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
	})
})