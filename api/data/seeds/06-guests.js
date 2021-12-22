const guests = [
  // Potluck 1
  { food_potluck_id: 1, potluck_id: 1, user_id: 1, attending: true },
  { food_potluck_id: 1, potluck_id: 1, user_id: 2, attending: false },
  { food_potluck_id: 2, potluck_id: 1, user_id: 3, attending: true },
  { food_potluck_id: 3, potluck_id: 1, user_id: 4, attending: true },
  // Potluck 2
  { food_potluck_id: 2, potluck_id: 2, user_id: 1, attending: true },
  { food_potluck_id: 4, potluck_id: 2, user_id: 2, attending: true },
  { food_potluck_id: 5, potluck_id: 2, user_id: 3, attending: false },
  { food_potluck_id: 6, potluck_id: 2, user_id: 4, attending: true },
]

exports.seed = function (knex) {
  return knex("guests").insert(guests)
}
