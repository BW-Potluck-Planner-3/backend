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

async function findUserById(req, res, next) {
  const { user_id } = req.params
  const existingUser = await Users.getById(user_id)
  if (!existingUser) {
    return next({
      status: 404,
      message: `User with id ${user_id} not found`
    })
  }
  return next()
}

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
  findUserById,
  findUserByUsername
};
