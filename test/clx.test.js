const { expect } = require('chai')
const __ = require('underscore')

describe('LivingForest', () => {
	const procId = 'procId'

	let testTarget, err
	let mqPublish

	beforeEach(function () {
		mqPublish = sinon.spy()
		err = new Error('any error message');
	})

	it('用例场景说明', () => {
		expect(1, 1)
	})
})