const Users = require('../users/users-model');
const { lowerCase } = require('lower-case');
const bcrypt = require('bcryptjs');

// Check for empty fields
const validateEmptyFields = (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    next({
      status: 400,
      message: 'username and password required',
    });
  } else {
    next();
  }
};

// Check for existing username
const validateUsername = async (req, res, next) => {
  try {
    const user = await Users.getBy({ username: lowerCase(req.body.username) });
    if (user) {
      next({
        status: 401,
        message: 'username already exists',
      });
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
};

// Hash password
const hashPassword = (req, res, next) => {
  const { username, password } = req.body;
  const rounds = process.env.BCRYPT_ROUNDS || 8;
  const hash = bcrypt.hashSync(password, rounds);

  req.body = {
    username,
    password: hash,
  };
  next();
};

module.exports = {
  validateEmptyFields,
  validateUsername,
  hashPassword,
};
