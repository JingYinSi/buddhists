const dbSave = require('./dbSave'),
	{ expect } = require('chai');

describe('Employee', () => {
	let err;
	const ID_NOT_EXIST = '5ce79b99da3537277c3f3b66',
		name = 'foo'

	let schema, testTarget, id, __v

	beforeEach(function (done) {
		err = new Error('any error message');
		return clearDB(done);
	})

	describe('Employee Pic changed', () => {
		// const mqPublish = require('../server/MessageCenter'),
		const mqPublish = require('@finelets/hyper-rest/mq'),
		name = 'foo',
		pic = 'pic url'

		let emp, publish

		beforeEach(() => {
			schema = require('../db/schema/bas/Employee')
			testTarget = require('../server/biz/bas/Employee')
			publish = sinon.spy()
			mqPublish['removePic'] = publish
		})

		it('employee无照片', () => {
			return dbSave(schema, {name})
				.then(doc => {
					emp = doc
					return testTarget.updatePic(doc.id, pic)
				})
				.then(() => {
					return schema.findById(emp.id)
				})
				.then((doc) => {
					expect(doc.pic).eql(pic)
					expect(doc.__v).eql(emp.__v + 1)
					expect(publish.callCount).eql(0)
				})
		})

		it('需删除旧照片', () => {
			const oldPic = 'old pic'
			return dbSave(schema, {name, pic: oldPic})
				.then(doc => {
					emp = doc
					return testTarget.updatePic(doc.id, pic)
				})
				.then(() => {
					return schema.findById(emp.id)
				})
				.then((doc) => {
					expect(doc.pic).eql(pic)
					expect(doc.__v).eql(emp.__v + 1)
					expect(publish.withArgs(oldPic).callCount).eql(1)
				})
		})
	})
})