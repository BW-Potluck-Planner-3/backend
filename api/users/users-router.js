const router = require('express').Router();
const Users = require('./users-model');
const Potlucks = require('../potlucks/potlucks-model');
const {
  checkPotluck,
  findUserByUsername,
} = require('./users-middleware');

// [GET] /api/users
router.get('/', async (req, res) => {
  res.json(await Users.getAll());
});

// [POST] /api/users/
router.post('/', findUserByUsername, async (req, res, next) => {
  const { user_id } = req.user
  try {
    res.status(200).json({ user_id });
  } catch (err) {
    next(err)
  }
});

// [GET] /api/users/:user_id
router.get('/:user_id', async (req, res) => {
  try {
    const { user_id, username } = await Users.getById(req.params.user_id);
    res.json({ user_id, username });
  } catch (err) {
    res.status(404).json({ message: `User with id ${req.params.user_id} not found` });
  }
});

// [GET] /api/users/:user_id/potlucks
router.get('/:user_id/potlucks', async (req, res, next) => {
  try {
    const potlucks = await Users.getPotlucksByUser(req.params.user_id);
    if (potlucks.length === 0) {
      res.json({
        message: `No potlucks found for User_ID ${req.params.user_id}`,
      });
    } else {
      res.json(potlucks);
    }
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
