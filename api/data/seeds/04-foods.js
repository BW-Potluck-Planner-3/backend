const foods = [
  { food_name: "chicken salad" },
  { food_name: "bread" },
  { food_name: "grilled chicken legs" },
  { food_name: "smoked ham" },
  { food_name: "corn on the cob" },
  { food_name: "grilled steak" },
]

exports.seed = function (knex) {
  return knex("foods").insert(foods)
}
