const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');

const router = new express.Router();

//create a new task

router.post('/tasks', auth, async (req, res) => {
	const task = new Task({
		...req.body,
		owner: req.user._id,
	});
	try {
		await task.save();
		res.status(201).send(task);
	} catch (error) {
		res.status(400).send(error);
	}
});

//Query all tasks

//GET tasks?completed=true || tasks?completed=false
//GET /tasks?limit=10 ... this will give you 10 results
//GET /tasks?limit=10&skip=10 ... this will give you page 2
//GET /tasks?sortBy=createdAt_desc //sorting tasks by created date, in descending order

router.get('/tasks', auth, async (req, res) => {
	try {
		const match = {};
		if (req.query.completed) {
			match.completed = req.query.completed === 'true';
		}

		const sort = {};

		if (req.query.sortBy) {
			const parts = req.query.sortBy.split(':');
			sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
			//this is basically saying, 'is the part of the
			//string after the colon equal to desc?' if so, -1, if not, 1.
		}

		//it is easy to filter by owner to get user's tasks
		// const tasks = await Task.find({ owner: req.user._id });
		// res.send(tasks);
		//alternately, we could populate the user, and then their tasks.
		await req.user
			.populate({
				path: 'tasks',
				match,
				options: {
					limit: parseInt(req.query.limit),
					skip: parseInt(req.query.skip),
					sort,
				},
			})
			.execPopulate();
		res.send(req.user.tasks);
	} catch (error) {
		res.status(500).send();
	}
});

router.get('/tasks/:id', auth, async (req, res) => {
	const _id = req.params.id;
	try {
		const task = await Task.findOne({ _id, owner: req.user._id });
		if (!task) {
			res.status(404).send();
		}
		res.send(task);
	} catch (error) {
		res.status(500).send(error);
	}
});

router.patch('/tasks/:id', auth, async (req, res) => {
	const updates = Object.keys(req.body);
	const isAllowed = ['task', 'completed'];
	const isValid = updates.every((update) => isAllowed.includes(update));

	if (!isValid) {
		return res.status(400).send({ error: 'invalid update fields.' });
	}

	try {
		const task = await Task.findOne({
			_id: req.params.id,
			owner: req.user._id,
		});

		if (!task) {
			return res.status(404).send();
		}

		//updating the task
		updates.forEach((update) => (task[update] = req.body[update]));

		await task.save();

		res.send(task);
	} catch (error) {
		res.status(400).send(error);
	}
});

router.delete('/tasks/:id', auth, async (req, res) => {
	const _id = req.params.id;
	const user_id = req.user._id;
	try {
		const task = await Task.findOneAndDelete({ _id, owner: user_id });
		if (!task) {
			return res.status(404).send();
		}
		res.send(task);
	} catch (error) {
		return res.status(500).send(error);
	}
});

module.exports = router;
