const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
	_id: userOneId,
	name: 'Harry Yianni',
	email: 'harry@harry.com',
	password: '1234567890',
	tokens: [
		{
			token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET),
		},
	],
};

beforeEach(async () => {
	await User.deleteMany();
	await new User(userOne).save();
});

test('Should register a new user', async () => {
	const response = await request(app)
		.post('/users')
		.send({
			name: 'Sarah Mattar',
			email: 'sarah@gmail.com',
			password: '1234567890',
		})
		.expect(201);

	//assert that the user was added to the database correctly
	const user = await User.findById(response.body.user._id);
	expect(user).not.toBeNull();

	//assert that the response body does contain the name of the user
	expect(response.body).toMatchObject({
		user: {
			name: 'Sarah Mattar',
			email: 'sarah@gmail.com',
		},
		token: user.tokens[0].token,
	});

	//assert that the password is hashed, not stored as plaintext
	expect(user.password).not.toBe('1234567890');
});

test('Should log in existing user', async () => {
	const response = await request(app)
		.post('/users/login')
		.send({ email: userOne.email, password: userOne.password })
		.expect(200);

	//assert that a second token should exist
	const user = await User.findById(userOneId);
	expect(response.body.token).toBe(user.tokens[1].token);
});

test('Should not login nonexistent user', async () => {
	await request(app)
		.post('/users/login')
		.send({
			email: 'sandy@sandy.com',
			password: '08Jan1954',
		})
		.expect(400);
});

test('Should query profile for authenticated user', async () => {
	await request(app)
		.get('/users/me')
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.send()
		.expect(200);
});

test('Should not query profile for unauthenticated user', async () => {
	await request(app)
		.get('/users/me')
		.send()
		.expect(401);
});

test('Should let authorized user delete account', async () => {
	await request(app)
		.delete('/users/me')
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.send()
		.expect(200);

	//assert that user account should be deleted
	const user = await User.findById(userOneId);
	expect(user).toBeNull();
});

test('Should not let unauthorized user delete account', async () => {
	await request(app)
		.delete('/users/me')
		.send()
		.expect(401);
});

test('Should upload avatar image', async () => {
	await request(app)
		.post('/users/me/avatar')
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.attach('avatar', './tests/fixtures/profile-pic.jpg')
		.expect(200);

	const user = await User.findById(userOneId);
	expect(user.avatar).toEqual(expect.any(Buffer));
});
