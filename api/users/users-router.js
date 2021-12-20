const router = require('express').Router();
const Users = require('./users-model');

// [GET] /api/users
router.get('/', async (req, res) => {
  res.json(await Users.getAll());
});

// [GET] /api/users/:user_id
router.get('/:user_id', async (req, res) => {
  try {
    const { user_id, username } = await Users.getById(req.params.user_id);
    res.json({ user_id, username });
  } catch (err) {
    res.json({ message: `User with id ${req.params.user_id} not found` });
  }
});

module.exports = router;
