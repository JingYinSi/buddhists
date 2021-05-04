var dbSave = require('./dbSave');

describe('权限管理', function () {
	const ID_NOT_EXIST = '5ce79b99da3537277c3f3b66'
	const Schema = require('../db/schema/bas/Employee'),
		id = '1223445666',
		userId = 'foo',
		name = 'foo name',
		password = 'wwwpsd',
		email = 'foo@qq.com',
		roles = 'user roles',
		pic = 'user pic'

	describe('用户', () => {
		const entity = require('../server/biz/bas/Employee')

		beforeEach((done) => {
			return clearDB(done);
		})

		// TODO: 注册用户时的数据校验
		it('注册用户', () => {
			const user = {
				userId,
				name,
				password,
				email
			}
			return entity.create(user)
				.then(() => {
					return Schema.findOne({
						userId
					})
				})
				.then((doc) => {
					expect(user).eql({
						userId: doc.userId,
						name: doc.name,
						password: doc.password,
						email: doc.email
					})
					expect(!doc.inUse).true
					expect(!doc.isAdmin).true
					expect(!doc.roles).true
				})
		})

		describe('授权', () => {
			let id, __v
			it('用户不存在', () => {
				return entity.authorize(ID_NOT_EXIST, {})
					.then(user => {
						expect(user).undefined
					})
			})

			it('__v不一致', ()=>{
				return dbSave(Schema, { userId, name })
					.then(doc => {
						id = doc.id,
						__v = doc.__v + 1
						return entity.authorize(id, {__v, isAdmin: true})
					})
					.then(doc => {
						expect(doc).undefined
					})
			})

			it('授权系统管理员', ()=>{
				return dbSave(Schema, { userId, name })
					.then(doc => {
						id = doc.id,
						__v = doc.__v
						return entity.authorize(id, {__v, isAdmin: true})
					})
					.then(doc => {
						expect(doc.inUse).true
                    	expect(doc.isAdmin).true
                    	expect(doc.roles).undefined
					})
			})

			it('授权角色', ()=>{
				return dbSave(Schema, { userId, name })
					.then(doc => {
						id = doc.id,
						__v = doc.__v
						return entity.authorize(id, {__v, roles})
					})
					.then(doc => {
						expect(doc.inUse).true
                    	expect(doc.isAdmin).undefined
                    	expect(doc.roles).eql(roles)
					})
			})

			it('收回授权', ()=>{
				return dbSave(Schema, { userId, name })
					.then(doc => {
						id = doc.id,
						__v = doc.__v
						return entity.authorize(id, {__v })
					})
					.then(doc => {
						expect(doc.inUse).undefined
                    	expect(doc.isAdmin).undefined
                    	expect(doc.roles).undefined
					})
			})
		})

		describe('认证', () => {
			const user = {
				userId,
				name,
				password,
				isAdmin: true,
				roles,
				pic,
				inUse: true
			}
			it('账号不一致，未获认证', () => {
				return dbSave(Schema, user)
					.then((doc) => {
						return entity.authenticate('unknown', password)
					})
					.then((theUser) => {
						expect(theUser).undefined
					})
			})

			it('密码不一致，未获认证', () => {
				return dbSave(Schema, user)
					.then((doc) => {
						return entity.authenticate(userId, 'wrong')
					})
					.then((theUser) => {
						expect(theUser).undefined
					})
			})

			it('未启用', () => {
				const unUsedUser = {
					...user
				}
				delete unUsedUser.inUse
				return dbSave(Schema, unUsedUser)
					.then((doc) => {
						return entity.authenticate(userId, password)
					})
					.then((theUser) => {
						expect(theUser).undefined
					})
			})

			it('账号密码一致，且已启用用户可获认证', () => {
				let id
				return dbSave(Schema, user)
					.then((doc) => {
						id = doc.id
						return entity.authenticate(userId, password)
					})
					.then((theUser) => {
						expect(theUser).eql({
							id,
							userId,
							name,
							pic,
							isAdmin: true,
							roles
						})
					})
			})
		})

		describe('按特定类型进行搜索', () => {
			let save
			beforeEach(() => {
				let records = []
				records.push(dbSave(Schema, {
					userId: 'userId1',
					name: 'user1'
				}))
				records.push(dbSave(Schema, {
					userId: 'userId2',
					name: 'user2',
					inUse: true
				}))
				records.push(dbSave(Schema, {
					userId: 'userId3',
					name: 'user3',
					inUse: false
				}))
				records.push(dbSave(Schema, {
					userId: 'userId4',
					name: 'user4',
					isAdmin: true
				}))
				records.push(dbSave(Schema, {
					userId: 'userId5',
					name: 'user5',
					isAdmin: false
				}))
				save = Promise.all(records)
			})

			it('所有 - ALL', () => {
				return save
					.then(() => {
						return entity.search({TYPE: 'ALL'})
					})
					.then((users) => {
						expect(users.length).eql(5)
					})
			})

			it('非用户 - NONUSER', () => {
				return save
					.then(() => {
						return entity.search({TYPE: 'NONUSER'})
					})
					.then((users) => {
						expect(users.length).eql(3)
					})
			})

			it('用户 - ALLUSER', () => {
				return save
					.then(() => {
						return entity.search({TYPE: 'ALLUSER'})
					})
					.then((users) => {
						expect(users.length).eql(2)
					})
			})

			it('系统管理员 - ADMIN', () => {
				return save
					.then(() => {
						return entity.search({TYPE: 'ADMIN'})
					})
					.then((users) => {
						expect(users.length).eql(1)
					})
			})

			it('非系统管理员用户 - NONADMINUSER', () => {
				return save
					.then(() => {
						return entity.search({TYPE: 'NONADMINUSER'})
					})
					.then((users) => {
						expect(users.length).eql(1)
					})
			})
		})
	})

	describe('CrossJwtConfig', () => {
		const createAuthConfig = require('../server/JwtConfig'),
			DEFAULT_ADMIN_ID = '$$$$cross$$admin'
		let dbAuth

		beforeEach(() => {
			dbAuth = sinon.stub({
				authenticate: () => {},
				getUser: () => {},
				haveAdmin: () => {}
			})
		})

		describe('authenticate', () => {
			const DEFAULT_ADMIN = {
				id: DEFAULT_ADMIN_ID,
				name: '系统管理员',
				isAdmin: true
			}
			let authenticate

			beforeEach(() => {
				authenticate = createAuthConfig(dbAuth).authenticate
			})
			it('未获认证', () => {
				dbAuth.authenticate.withArgs(userId, password).resolves()
				return authenticate(userId, password)
					.then((user) => {
						expect(user).undefined
					})
			})

			it('缺省系统管理员', () => {
				authenticate = createAuthConfig({}).authenticate
				return authenticate('@admin@', '$9999$')
					.then((user) => {
						expect(user).eql(DEFAULT_ADMIN)
					})
			})

			it('系统当前不存在系统管理员时，则认证缺省系统管理员', () => {
				dbAuth.haveAdmin.resolves(0)
				return authenticate('@admin@', '$9999$')
					.then((user) => {
						expect(user).eql(DEFAULT_ADMIN)
					})
			})

			it('存在系统管理员时，则拒绝缺省系统管理员', () => {
				dbAuth.haveAdmin.resolves(1)
				return authenticate('@admin@', '$9999$')
					.then((user) => {
						expect(user).undefined
					})
			})

			it('普通用户', () => {
				dbAuth.authenticate.withArgs(userId, password).resolves({
					id
				})
				return authenticate(userId, password)
					.then((user) => {
						expect(user.id).eql(id)
					})
			})
		})

		describe('用户信息', () => {
			let getUser

			beforeEach(() => {
				getUser = createAuthConfig(dbAuth).getUser
			})

			it('缺省系统管理员', () => {
				return getUser(DEFAULT_ADMIN_ID)
					.then((user) => {
						expect(user).eql({
							isAdmin: true
						})
					})
			})

			it('普通用户', () => {
				const userInfo = {
					userInfo: 'any data of userinfo'
				}
				dbAuth.getUser.withArgs(id).resolves(userInfo)
				return getUser(id)
					.then((user) => {
						expect(user).eql(userInfo)
					})
			})
		})

	})
})