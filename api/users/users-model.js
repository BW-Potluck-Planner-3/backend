const db = require('../data/db-config');
const { lowerCase } = require('lower-case');

const getAll = () => db('users').select('user_id', 'username');

const getBy = (filter) => db('users').where(filter);

const getById = (user_id) => db('users').where({ user_id }).first();

const getByIdPotlucks = (user_id) => {
  return db('guests as g')
    .join('potlucks as p', 'g.potluck_id', 'p.potluck_id')
    .where('g.user_id', user_id)
    .select(
      'g.potluck_id',
      'g.attending',
      'p.potluck_name',
      'p.date',
      'p.time',
      'p.location'
    )
    .orderBy('g.potluck_id');
};

const getPotlucksByUser = (user_id) => {
  return db('potlucks as p').where({ user_id }).orderBy('p.potluck_id', 'desc');
}

const add = async ({ username, password }) => {
  const [newUserObj] = await db('users').insert(
    { username: lowerCase(username), password },
    ['user_id', 'username']
  );
  return newUserObj;
};

module.exports = {
  getAll,
  getBy,
  getById,
  getByIdPotlucks,
  getPotlucksByUser,
  add,
};
