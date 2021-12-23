const router = require('express').Router();
const Users = require('../users/users-model');
const {
  validateEmptyFields,
  validateUsername,
  hashPassword,
  validateLogin,
} = require('./auth-middleware');

// [POST] /api/auth/register
router.post(
  '/register',
  validateEmptyFields,
  validateUsername,
  hashPassword,
  (req, res, next) => {
    Users.add(req.body)
      .then((user) => {
        res.status(201).json({
          message: `Successfully registered ${user.username}`,
        });
      })
      .catch(next);
  }
);

// [POST] /api/auth/login
router.post('/login', validateEmptyFields, validateLogin, (req, res, next) => {
  res.status(200).json({
    message: `Welcome back ${req.body.username}!`,
    token: req.token,
    user_id: req.user_id
  });
  next();
});

module.exports = router;
