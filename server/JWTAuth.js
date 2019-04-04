var jwt = require('jsonwebtoken');
var config = require('./config');

// Verify that the JWT is authentic, if the token is authentic then it will be decoded 
// And the user_id can be used
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

// Create a JWT token and store the user_id in the token to use for requests
// It will be encoded with a secret and algorithm
function createJWTToken(id) {
	return jwt.sign({ id: id }, config.jwtsecret, { expiresIn: 86400, algorithm: 'HS256' });
}

// If a web request has a JWT, it will be verified and decoded (using verifyJWTToken) here and passed onto the API route that has
// been called, in which the user_id can be used by calling req.userId. If there is no token, the user will not be able to gain access
// to the route and will recieve an error message of 'Invalid auth token provided.' 
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
