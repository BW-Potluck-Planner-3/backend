const Users = require("./users-model")

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

async function findUserByUsername(req, res, next) {
  const { username } = req.body
  if (!username) {
    return next({
      status: 400,
      message: `Username must be provided`
    })
  }
  const [existingUser] = await Users.getBy({ username })
  if (!existingUser) {
    return next({
      status: 404,
      message: `${username} does not exist`
    })
  }
  req.user = existingUser
  return next()
}

module.exports = {
  checkPotluck,
  findUserByUsername
};
