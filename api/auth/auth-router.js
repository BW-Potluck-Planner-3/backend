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

module.exports = router;
