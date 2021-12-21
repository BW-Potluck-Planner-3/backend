const potluckDates = [
  new Date(Date.UTC(2022, 2, 3, 13, 30)),
  new Date(Date.UTC(2022, 1, 12, 14, 30))
]

function getDate(date) { // pulls year, month, and day from JS date
  const year = date.getUTCFullYear()
  const month = date.getUTCMonth()
  const day = date.getUTCDate()
  return `${month}/${day}/${year}`
}

function getTime(date) { // pulls hour and minute from JS date
  let hour = date.getUTCHours()
  const minute = date.getUTCMinutes()
  if (hour > 12) {
    hour -= 12
    return `${hour}:${minute} PM UTC`
  }
  return `${hour}:${minute} AM UTC`
}

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
