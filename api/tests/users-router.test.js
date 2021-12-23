const request = require('supertest')
const server = require('../server')
const db = require('../data/db-config')
const {
  getReqTokenTests,
  postReqTokenTests,
} = require("./test-helpers")

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})
beforeEach(async () => {
  await db.seed.run()
})
afterAll(async () => {
  await db.destroy()
})


/* ========== [GET] - /api/users ========== */

describe("[GET] - /api/users", () => {
  describe("requesting with a valid token", () => {
    let res
    beforeEach(async () => {
      const loginRes = await request(server)
        .post("/api/auth/login")
        .send({
          username: "frodo",
          password: "1234"
        })
      res = await request(server)
        .get("/api/users")
        .set("Authorization", loginRes.body.token)
    })
    it("responds with an array of users", () => {
      const actual = res.body
      expect(actual).toHaveLength(5)
      actual.forEach(potluck => {
        expect(potluck).toHaveProperty("username")
        expect(potluck).toHaveProperty("user_id")
      })
    })
    it("responds with the status code 200", () => {
      expect(res.status).toBe(200)
    })
  })

  getReqTokenTests("/api/users")

})

/* ========== [POST] - /api/users ========== */

describe("[POST] - /api/users", () => {
  describe("requesting with a valid token", () => {
    let res
    beforeAll(async () => {
      const loginRes = await request(server)
        .post("/api/auth/login")
        .send({
          username: "piPPIN",
          password: "1234"
        })
      res = await request(server)
        .post("/api/users")
        .set("Authorization", loginRes.body.token)
        .send({
          username: "sam"
        })
    })
    describe("to find an existing user by their username", () => {
      it("resonds with an object containing the user's user_id", async () => {
        const actual = res.body
        expect(actual).toHaveProperty("user_id")
      })
      it("responds with the status code 200", async () => {
        expect(res.status).toBe(200)
      })
    })

    describe("to find a user that doesn not exist by their username", () => {
      let res
      beforeAll(async () => {
        const loginRes = await request(server)
          .post("/api/auth/login")
          .send({
            username: "SaM",
            password: "1234"
          })
        res = await request(server)
          .post("/api/users")
          .set("Authorization", loginRes.body.token)
          .send({
            username: "jimmy10000"
          })
      })
      it("responds with '_username_ does not exist'", () => {
        const expected = /jimmy10000 does not exist/i
        expect(res.body.message).toMatch(expected)
      })
      it("responds with the status code 404", () => {
        expect(res.status).toBe(404)
      })
    })

    describe("to find a user by their username without providing a username", () => {
      let res
      beforeAll(async () => {
        const loginRes = await request(server)
          .post("/api/auth/login")
          .send({
            username: "SaM",
            password: "1234"
          })
        res = await request(server)
          .post("/api/users")
          .set("Authorization", loginRes.body.token)
          .send({
            bad: "apple"
          })
      })
      it("responds with 'Username must be provided'", () => {
        const expected = /username must be provided/i
        expect(res.body.message).toMatch(expected)
      })
      it("responds with the status code 400", () => {
        expect(res.status).toBe(400)
      })
    })
  })

  postReqTokenTests("/api/potlucks/3/guests", { username: "jimmy10000" })

})

describe("[GET] - /api/users/:user_id", () => {
  describe("requesting with a valid token", () => {
    let res
    beforeEach(async () => {
      const loginRes = await request(server)
        .post("/api/auth/login")
        .send({
          username: "meRRY",
          password: "1234"
        })
      res = await request(server)
        .get("/api/users/1")
        .set("Authorization", loginRes.body.token)
    })
    it("responds with an object containing a usersname and user_id", () => {
      const actual = res.body
      expect(actual).toHaveProperty("username")
      expect(actual).toHaveProperty("user_id")
    })
    it("responds with the status code 200", () => {
      expect(res.status).toBe(200)
    })
  })

  getReqTokenTests("/api/users/1")

})
