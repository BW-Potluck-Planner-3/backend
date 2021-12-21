const Potlucks = require('../potlucks/potlucks-model');

const checkPotluck = (req, res, next) => {
  if (Object.keys(req.body).length === 0)
    next({
      status: 400,
      message: 'Potluck information required',
    });
  const { potluck_name, date, time, location } = req.body;
  if (!potluck_name || !date || !time || !location)
    next({
      status: 400,
      message: 'Potluck information required',
    });
  next();
};

module.exports = {
  checkPotluck,
};
