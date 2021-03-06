const Users = require('../users/users-model');
const { lowerCase } = require('lower-case');
const bcrypt = require('bcryptjs');
const { BCRYPT_ROUNDS } = require('../secrets');
const tokenBuilder = require('./token-builder');

// Check for empty fields
const validateEmptyFields = (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    next({
      status: 401,
      message: 'Username and password required',
    });
  } else {
    next();
  }
};

// Check for existing username
const validateUsername = async (req, res, next) => {
  try {
    const { username } = req.body;
    const [user] = await Users.getBy({
      username: lowerCase(username),
    });
    if (user) {
      next({
        status: 401,
        message: 'Username already exists',
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
  const rounds = BCRYPT_ROUNDS;
  const hash = bcrypt.hashSync(password, rounds);

  req.body = {
    username,
    password: hash,
  };
  next();
};

// Login validations
const validateLogin = async (req, res, next) => {
  const { username, password } = req.body;
  const [user] = await Users.getBy({ username: lowerCase(username) });
  try {
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = tokenBuilder(user);
      req.token = token;
      req.user_id = user.user_id
      next();
    } else {
      next({
        status: 401,
        message: 'Invalid credentials',
      });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  validateEmptyFields,
  validateUsername,
  hashPassword,
  validateLogin,
};
