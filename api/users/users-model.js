const db = require('../data/db-config');
const { lowerCase } = require('lower-case');

const getAll = () => db('users').select('user_id', 'username');

const getBy = (filter) => db('users').where(filter);

const getById = (user_id) => db('users').where({ user_id }).first();

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
  add,
};
