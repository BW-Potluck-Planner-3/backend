const Potlucks = require('./potlucks-model');
const Users = require('../users/users-model');

const checkPotluckId = async (req, res, next) => {
  try {
    const potluck = await Potlucks.getById(req.params.potluck_id);
    if (potluck) {
      req.potluck = potluck;
      next();
    } else {
      next({
        status: 404,
        message: `Potluck with id ${req.params.potluck_id} not found`,
      });
    }
  } catch (err) {
    next(err);
  }
};

const validatePotluckPayload = async (req, res, next) => {
  try {
    const required = ['potluck_name', 'date', 'time', 'location'];
    if (!required.every((field) => req.body[field])) {
      next({
        status: 400,
        message: `${required
          .filter((field) => !req.body[field])
          .join(', ')} is missing`,
      });
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
};

async function validateAddGuestPayload(req, res, next) {
  const { user_id, attending } = req.body;
  if (!user_id || !attending || typeof attending !== 'boolean') {
    return next({
      status: 400,
      message: 'Please provide a user_id and an attending boolean',
    });
  }
  const existingUser = await Users.getById(user_id);
  if (!existingUser) {
    return next({
      status: 404,
      message: `User with id of ${user_id} does not exist`,
    });
  }
  const potluck = await Potlucks.getById(req.params.potluck_id);
  if (potluck.user_id === user_id) {
    return next({
      status: 400,
      message: 'Cannot add a potluck organizer as their own guest',
    });
  }
  req.body.guest = {
    user_id: existingUser.user_id,
    attending: req.body.attending,
  };
  return next();
}

const validateUpdateGuestPayload = async (req, res, next) => {
  const { attending } = req.body;
  console.log(attending);
  if (attending === true || attending === false) {
    req.body = {
      attending,
    };
    next();
  } else {
    next({
      status: 400,
      message: 'Missing or invalid attending status',
    });
  }
};

module.exports = {
  checkPotluckId,
  validatePotluckPayload,
  validateAddGuestPayload,
  validateUpdateGuestPayload,
};
