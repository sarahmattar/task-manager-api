const request = require('supertest');
const app = require('../src/app');
const Task = require('../src/models/task');
const {
	setupDatabase,
	userOne,
	userOneId,
	userTwo,
	userTwoId,
	taskOne,
	taskTwo,
	taskThree,
} = require('./fixtures/db');

beforeEach(setupDatabase);

test('Should create task for user', async () => {
	const response = await request(app)
		.post('/tasks/')
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.send({
			task: 'Finish this damn unit testing',
		})
		.expect(201);

	//assert that the task is saved to the database, and completed is false
	const task = await Task.findById(response.body._id);
	expect(task).not.toBeNull();
	expect(task.completed).toBe(false);
});

test('Should return only tasks for owner', async () => {
	const response = await request(app)
		.get('/tasks')
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.send()
		.expect(200);

	expect(response.body.length).toEqual(2);
});

test('Should not be able to delete task if unauthorized', async () => {
	const response = await request(app)
		.delete(`/tasks/${taskOne._id}`)
		.set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
		.send()
		.expect(404);

	const task = await Task.findById(taskOne._id);
	expect(task).not.toBeNull();
});
