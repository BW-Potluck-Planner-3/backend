const food_potluck = [
  // Potluck 1
  { food_id: 1, potluck_id: 1 },
  { food_id: 2, potluck_id: 1 },
  { food_id: 3, potluck_id: 1 },
  // Potluck 2
  { food_id: 2, potluck_id: 2 },
  { food_id: 4, potluck_id: 2 },
  { food_id: 5, potluck_id: 2 },
  { food_id: 6, potluck_id: 2 },
]

exports.seed = function (knex) {
  return knex("food_potluck").insert(food_potluck)
}
