const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
	try {
		const token = req.header('Authorization').replace('Bearer ', ''); //this removes the Bearer prefix
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		// validate the token, and make sure it is still in the tokens array
		const user = await User.findOne({
			_id: decoded._id,
			'tokens.token': token,
		});
		if (!user) {
			throw new Error();
		}

		// store the generated token for future use
		req.token = token;

		// store the user variable so another route handler doesn't have to do the same work
		req.user = user;

		next();
	} catch (error) {
		res.status(401).send({ error: 'Please authenticate' });
	}
};

module.exports = auth;
