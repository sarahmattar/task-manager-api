const express = require('express');
const User = require('../models/user');
const router = new express.Router();
const multer = require('multer');
const sharp = require('sharp');
const { sendWelcomeEmail, sendCancelEmail } = require('../emails/account');

const auth = require('../middleware/auth');
const upload = multer({
	limits: {
		fileSize: 5000000, //this is in bytes so 5mb is 5 million bytes
	},
	fileFilter(req, file, cb) {
		if (!file.originalname.match(/\.(jpeg|jpg|png)$/)) {
			return cb(
				new Error(
					'File must be one of the following image types: .jpg, .jpeg, .png.'
				)
			);
		}
		cb(undefined, true);
	},
});

//create a new user
router.post('/users', async (req, res) => {
	const user = new User(req.body);

	try {
		//save the user
		await user.save();
		sendWelcomeEmail(user.email, user.name);
		//then generate an authentication token for the user
		const token = await user.generateAuthToken();
		res.status(201).send({ user, token });
	} catch (error) {
		res.status(400).send(error);
	}
});

//login existing user
//use the token generated to log a user in.
router.post('/users/login', async (req, res) => {
	try {
		const user = await User.findByCredentials(
			req.body.email,
			req.body.password
		);
		const token = await user.generateAuthToken();
		res.send({ user, token });
	} catch (error) {
		res.status(400).send();
	}
});

// logout a user from current session

router.post('/users/logout', auth, async (req, res) => {
	try {
		req.user.tokens = req.user.tokens.filter((token) => {
			// keeps the unused tokens in the tokens array
			return token.token !== req.token;
		});

		await req.user.save();
		res.send();
	} catch (error) {
		res.status(500).send();
	}
});

// logout a user from all sessions (remove all tokens from array)

router.post('/users/logoutAll', auth, async (req, res) => {
	try {
		req.user.tokens = [];
		await req.user.save();
		res.send();
	} catch (error) {
		res.status(500).send();
	}
});

//allow user to view their own profile
router.get('/users/me', auth, async (req, res) => {
	//this will allow the user to get their own profile information.
	res.send(req.user);
});

// allow users to update their profile, not others via id
router.patch('/users/me', auth, async (req, res) => {
	const updates = Object.keys(req.body);
	const isAllowed = ['name', 'email', 'age', 'password'];
	const isValid = updates.every((update) => isAllowed.includes(update));

	if (!isValid) {
		res.status(400).send({ error: 'invalid update fields.' });
	}

	try {
		//this is called bracket notation, it is dynamic
		updates.forEach((update) => (req.user[update] = req.body[update]));

		await req.user.save();

		res.send(req.user);
	} catch (error) {
		res.status(400).send(error);
	}
});

//users should be able to delete their own profile only, not delete by id
router.delete('/users/me', auth, async (req, res) => {
	try {
		sendCancelEmail(req.user.email, req.user.name);
		const user = await User.findByIdAndDelete({ _id: req.user._id });
		res.send(user);
	} catch (error) {
		res.status(500).send();
	}
});

//uploading profile picture, assigning it to an authenticated user.

router.post(
	'/users/me/avatar',
	auth,
	upload.single('avatar'),
	async (req, res) => {
		//we will give Sharp the original image and it will do the work
		const buffer = await sharp(req.file.buffer)
			.resize({
				width: 250,
				height: 250,
			})
			.png()
			.toBuffer();
		req.user.avatar = buffer;
		await req.user.save();
		res.send();
	},
	(error, req, res, next) => {
		res.status(500).send({ error: error.message });
	}
);

//delete a user's avatar

router.delete('/users/me/avatar', auth, async (req, res) => {
	req.user.avatar = undefined;
	await req.user.save();
	res.send();
});

//fetching a user's avatar

router.get('/users/:id/avatar', async (req, res) => {
	try {
		const user = await User.findById(req.params.id);

		if (!user || !user.avatar) {
			throw new Error();
		}

		res.set('Content-Type', 'image/png'); //set the headers for the response
		res.send(user.avatar);
	} catch (error) {
		res.status(404).send();
	}
});

module.exports = router;
