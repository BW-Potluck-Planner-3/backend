const Potlucks = require('./potlucks-model');

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

module.exports = { checkPotluckId };
