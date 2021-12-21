const {
  getDate,
  getTime
} = require("../../potlucks/potluck-helpers")

const potluckDates = [
  new Date(Date.UTC(2022, 2, 3, 13, 30)),
  new Date(Date.UTC(2022, 1, 12, 14, 30))
]

const potlucks = [
  {
    potluck_name: "Frodo's Farewell Party",
    date: getDate(potluckDates[0]),
    time: getTime(potluckDates[0]),
    location: "The Shire",
    user_id: 2
  },
  {
    potluck_name: "Pippin's Great Big Feast",
    date: getDate(potluckDates[1]),
    time: getTime(potluckDates[1]),
    location: "The Shire",
    user_id: 3
  },
]

exports.seed = function (knex) {
  return knex("potlucks").insert(potlucks)
}
