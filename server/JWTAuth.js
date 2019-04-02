var jwt = require('jsonwebtoken');
var config = require('./config');

function verifyJWTToken(token) {
	return new Promise((resolve, reject) => {
		if (token === 'undefined') reject(error);
		jwt.verify(token, config.jwtsecret, (error, decoded) => {
			if (error || !decoded) {
				return reject(error);
			} else return resolve(decoded);
		});
	});
}

function createJWTToken(id) {
	return jwt.sign({ id: id }, config.jwtsecret, { expiresIn: 86400, algorithm: 'HS256' });
}

function verifyJWTRESTRequest(req, res, next) {
	if (req.headers.authorization === undefined)
		return res.status(400).send({ message: 'Invalid auth token provided.' });

	verifyJWTToken(req.headers.authorization.split(' ')[1])
		.then((token) => {
			req.userId = token.id;
			next();
		})
		.catch((error) => {
			return res.status(400).json({ message: 'Invalid auth token provided.' });
		});
}

module.exports = {
	createJWTToken,
	verifyJWTRESTRequest
};
