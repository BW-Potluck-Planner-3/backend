const router = require('express').Router();
const Potlucks = require('./potlucks-model');
const {
  checkPotluckId,
  validatePotluckPayload,
  validateAddGuestPayload,
} = require('./potluck-middleware');

// [GET] /api/potlucks
router.get('/', (req, res, next) => {
  Potlucks.getAll()
    .then((potlucks) => {
      res.status(200).json(potlucks);
    })
    .catch(next);
});

// [GET] /api/potlucks/:potluck_id
router.get('/:potluck_id', checkPotluckId, async (req, res, next) => {
  try {
    const guests = await Potlucks.getIdGuests(req.params.potluck_id);
    const foods = await Potlucks.getByIdFoods(req.params.potluck_id);
    if (foods.length !== 0) {
      res.status(200).json({ ...req.potluck, guests, foods });
    } else {
      res.status(200).json({
        ...req.potluck,
        guests,
        foods: 'No foods added for this potluck',
      });
    }
  } catch (err) {
    next(err);
  }
});

// [GET] /api/potlucks/:potluck_id/guests
router.get('/:potluck_id/guests', checkPotluckId, async (req, res, next) => {
  try {
    const guests = await Potlucks.getIdGuests(req.params.potluck_id);
    res.status(200).json(guests);
  } catch (err) {
    next(err);
  }
});

// [GET] /api/potlucks/:potluck_id/foods
router.get('/:potluck_id/foods', checkPotluckId, async (req, res, next) => {
  try {
    const foods = await Potlucks.getByIdFoods(req.params.potluck_id);
    if (foods.length !== 0) {
      res.status(200).json(foods);
    } else {
      next({
        status: 404,
        message: 'No foods listed for this potluck',
      });
    }
  } catch (err) {
    next(err);
  }
});

// [POST] /api/potlucks/:potluck_id/guests
router.post(
  '/:potluck_id/guests',
  checkPotluckId,
  validateAddGuestPayload,
  async (req, res, next) => {
    try {
      const guest = await Potlucks.addGuest(
        req.params.potluck_id,
        req.body.guest
      );
      res.status(201).json(guest);
    } catch (err) {
      next(err);
    }
  }
);

// [POST] /api/potlucks/:potluck_id/foods
router.post('/:potluck_id/foods', checkPotluckId, async (req, res, next) => {
  try {
    const foods = await Potlucks.addFood(req.params.potluck_id, req.body);
    res.status(201).json(foods);
  } catch (err) {
    next(err);
  }
});

// [PUT] /api/potlucks/:potluck_id
router.put(
  '/:potluck_id',
  checkPotluckId,
  validatePotluckPayload,
  async (req, res, next) => {
    try {
      const potluck = await Potlucks.update(req.params.potluck_id, req.body);
      res.status(200).json(potluck);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
