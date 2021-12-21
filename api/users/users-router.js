const router = require('express').Router();
const Users = require('./users-model');
const Potlucks = require('../potlucks/potlucks-model');
const { checkPotluck } = require('./users-middleware');

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

// [GET] /api/users/:user_id/potlucks
router.get('/:user_id/potlucks', async (req, res, next) => {
  try {
    const potlucks = await Users.getByIdPotlucks(req.params.user_id);
    res.json(potlucks);
  } catch (err) {
    next(err);
  }
});

// [POST] /api/users/:user_id/potlucks
router.post('/:user_id/potlucks', checkPotluck, async (req, res, next) => {
  try {
    const potluck = await Potlucks.addPotluck({
      ...req.body,
      user_id: req.params.user_id,
    });
    const guest = { user_id: req.params.user_id, attending: true };
    const firstGuest = await Potlucks.addGuest(potluck.potluck_id, guest);
    res.status(201).json({ ...potluck, guests: [firstGuest] });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
