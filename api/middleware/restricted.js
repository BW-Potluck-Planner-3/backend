const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../secrets');

module.exports = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    next({
      status: 401,
      message: 'token required',
    });
  } else {
    jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
      if (err) {
        next({
          status: 401,
          message: 'invalid token',
        });
      }
      req.decodedToken = decodedToken;
      next();
    });
  }
};
