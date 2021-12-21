function getDate(date) { // pulls year, month, and day from JS UTC date
  const year = date.getUTCFullYear()
  const month = date.getUTCMonth()
  const day = date.getUTCDate()
  return `${month}/${day}/${year}`
}

function getTime(date) { // pulls hour and minute from JS UTC date
  let hour = date.getUTCHours()
  const minute = date.getUTCMinutes()
  if (hour > 12) {
    hour -= 12
    return `${hour}:${minute} PM UTC`
  }
  return `${hour}:${minute} AM UTC`
}

module.exports = {
  getDate,
  getTime,
}
