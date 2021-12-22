const {
  getDate,
  getTime
} = require("../../potlucks/potluck-helpers")

const potluckDates = [
  new Date(Date.UTC(2022, 2, 3, 13, 30)),
  new Date(Date.UTC(2022, 1, 12, 14, 30)),
  new Date(Date.UTC(2022, 4, 9, 18, 0))
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
  {
    potluck_name: "Tom's Roarin' Dusk Feast",
    date: getDate(potluckDates[2]),
    time: getTime(potluckDates[2]),
    location: "Gondor",
    user_id: 5
  },
]

exports.seed = function (knex) {
  return knex("potlucks").insert(potlucks)
}
