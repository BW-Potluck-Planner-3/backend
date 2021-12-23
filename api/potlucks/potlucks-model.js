const db = require('../data/db-config');
const mappers = require('../utils/mappers');

const getAll = () => db('potlucks');

const getById = (potluck_id) => db('potlucks').where({ potluck_id }).first();

const getIdGuests = (potluck_id) => {
  return db('potlucks as p')
    .leftJoin('guests as g', 'p.potluck_id', 'g.potluck_id')
    .leftJoin('users as u', 'u.user_id', 'g.user_id')
    .where('p.potluck_id', potluck_id)
    .select('u.user_id', 'u.username', 'g.attending')
    .orderBy('u.user_id')
    .then((guests) =>
      guests ? guests.map((guest) => mappers.displayTrueFalse(guest)) : null
    );
};

const getByIdFoods = (potluck_id) => {
  return db('food_potluck as fp')
    .leftJoin('potlucks as p', 'fp.potluck_id', 'p.potluck_id')
    .leftJoin('foods as f', 'f.food_id', 'fp.food_id')
    .leftJoin('users as u', 'u.user_id', 'p.user_id')
    .where('fp.potluck_id', potluck_id)
    .select('f.food_name', 'u.user_id', 'u.username')
    .orderBy('f.food_name');
};

const addPotluck = (potluck) => {
  return db('potlucks')
    .insert(potluck, 'potluck_id')
    .then(([potluck_id]) => getById(potluck_id));
};

const addGuest = (potluck_id, guest) => {
  return db('guests')
    .insert({
      potluck_id,
      user_id: guest.user_id,
      attending: guest.attending,
    })
    .returning()
    .then(() => getIdGuests(potluck_id));
};

const addFood = (potluck_id, food) => {
  return db('foods')
    .insert({ food_name: food.food_name }, 'food_id')
    .then(([food_id]) => {
      return db('food_potluck')
        .insert({
          food_id,
          potluck_id,
        })
        .then(() => getByIdFoods(potluck_id));
    });
};

const update = (potluck_id, changes) => {
  return db('potlucks')
    .where({ potluck_id })
    .update(changes)
    .then(() => getById(potluck_id));
};

const updateGuest = (potluck_id, user_id, changes) => {
  return db('guests')
    .where({ potluck_id, user_id })
    .update(changes)
    .then(() => getIdGuests(potluck_id));
};

const remove = (potluck_id) => db('potlucks').where({ potluck_id }).del();

const removeGuest = (potluck_id, user_id) => {
  return db('guests')
    .where({ potluck_id, user_id })
    .del()
    .then(() => getAll());
};

const removeFood = (potluck_id, food_name) => {
  return db('foods')
    .where({ food_name })
    .del()
    .then(() => {
      return db('food_potluck')
        .where({ potluck_id, food_name })
        .del()
        .then(() => getByIdFoods(potluck_id));
    });
};

module.exports = {
  getAll,
  getById,
  getIdGuests,
  getByIdFoods,
  addPotluck,
  addGuest,
  addFood,
  update,
  updateGuest,
  remove,
  removeGuest,
  removeFood,
};
