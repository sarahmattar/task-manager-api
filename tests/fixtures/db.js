const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../../src/models/user');
const Task = require('../../src/models/Task');

//Seed Data
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

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
	_id: userTwoId,
	name: 'Sandy Yianni',
	email: 'sandy@sandy.com',
	password: '1234567890',
	tokens: [
		{
			token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET),
		},
	],
};

const taskOne = {
	_id: new mongoose.Types.ObjectId(),
	task: 'First task',
	completed: false,
	owner: userOneId,
};
const taskTwo = {
	_id: new mongoose.Types.ObjectId(),
	task: 'Second task',
	completed: true,
	owner: userOneId,
};
const taskThree = {
	_id: new mongoose.Types.ObjectId(),
	task: 'Third task',
	completed: false,
	owner: userTwoId,
};

const setupDatabase = async () => {
	await User.deleteMany();
	await Task.deleteMany();
	await new User(userOne).save();
	await new User(userTwo).save();
	await new Task(taskOne).save();
	await new Task(taskTwo).save();
	await new Task(taskThree).save();
};

module.exports = {
	userOneId,
	userOne,
	userTwoId,
	userTwo,
	taskOne,
	taskTwo,
	taskThree,
	setupDatabase,
};
