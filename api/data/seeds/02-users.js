const bcrypt = require("bcryptjs")
const { BCRYPT_ROUNDS } = require("../../secrets")

const users = [
  { username: "sam", password: bcrypt.hashSync("1234", BCRYPT_ROUNDS) },
  { username: "frodo", password: bcrypt.hashSync("1234", BCRYPT_ROUNDS) },
  { username: "pippin", password: bcrypt.hashSync("1234", BCRYPT_ROUNDS) },
  { username: "merry", password: bcrypt.hashSync("1234", BCRYPT_ROUNDS) },
  { username: "tom", password: bcrypt.hashSync("1234", BCRYPT_ROUNDS) },
]

exports.seed = function (knex) {
  return knex("users").insert(users)
}
