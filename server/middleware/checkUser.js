const jwt = require("jsonwebtoken");
require('dotenv').config();

// check current user
const checkUser = (req, res, next) => {
	const token = req.cookies.login;
	if (token) {
		jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedToken) => {
			if (err) {
				res.status(500);
				next();
			}
			else {
				res.user = decodedToken;
				res.status(200);
				next();
			}
		})
	}
	else {
		res.status(401);
		next();
	}
}

module.exports = { checkUser };