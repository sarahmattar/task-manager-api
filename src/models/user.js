const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task');

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			trim: true,
			lowercase: true,
			unique: true,
			validate(value) {
				if (!validator.isEmail(value)) {
					throw new Error('email is invalid');
				}
			},
		},
		password: {
			type: String,
			required: true,
			minlength: 7,
			validate(value) {
				if (value.includes('password')) {
					throw new Error(
						"password field cannot contain the word 'password'."
					);
				}
			},
		},
		age: {
			type: Number,
			default: 0,
			validate(value) {
				if (value < 0) {
					throw new Error('Age must be greater than zero.');
				}
			},
		},
		avatar: {
			type: Buffer, // this will allow us to store binary image data in the mongoDB database
		},
		tokens: [
			{
				token: {
					type: String,
					required: true,
				},
			},
		],
	},
	{
		timestamps: true,
	}
);

//Set up virtual property

userSchema.virtual('tasks', {
	ref: 'Task',
	localField: '_id',
	foreignField: 'owner',
});

//New static method - findByCredentials()

userSchema.statics.findByCredentials = async (email, password) => {
	const user = await User.findOne({ email });
	if (!user) {
		throw new Error('user not found');
	}
	const isMatch = await bcrypt.compare(password, user.password);

	if (!isMatch) {
		throw new Error('incorrect password');
	}

	return user;
};

// this is accessible on instances of our models as opposed to the models themselves.
userSchema.methods.generateAuthToken = async function() {
	const user = this;
	const token = jwt.sign({ _id: user._id.toString() }, 'thisismynewcourse');
	//associate the generated token with the user's profile by concatenating the array
	user.tokens = user.tokens.concat({ token });
	//save the user profile with the token(s) to the database
	await user.save();
	return token;
};

//return only the public details of the user profile, not tokens or passwords
//the .toJSON method
userSchema.methods.toJSON = function() {
	const user = this;
	const userObject = user.toObject();

	//use delete operator to remove properties from object
	delete userObject.password;
	delete userObject.tokens;
	delete userObject.avatar;
	return userObject;
};

//Hash the plaintext password
userSchema.pre('save', async function(next) {
	const user = this;

	if (user.isModified('password')) {
		user.password = await bcrypt.hash(user.password, 8);
	}
	next();
});

// Delete the user's tasks when the user is deleted
userSchema.pre('remove', async function() {
	const user = this;
	//load the task model, and then use Task to remove the tasks
	await Task.deleteMany({ owner: user._id });
	next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
