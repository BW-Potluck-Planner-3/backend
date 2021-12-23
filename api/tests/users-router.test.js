const request = require('supertest')
const server = require('../server')
const db = require('../data/db-config')
const {
  runTokenTests
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

  runTokenTests("/api/users")

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

  runTokenTests("/api/potlucks/3/guests", { username: "jimmy10000" })

})

describe("[GET] - /api/users/:user_id", () => {
  describe("requesting with a valid token", () => {
    let res
    let errorRes
    beforeAll(async () => {
      const loginRes = await request(server)
        .post("/api/auth/login")
        .send({
          username: "meRRY",
          password: "1234"
        })
      res = await request(server)
        .get("/api/users/1")
        .set("Authorization", loginRes.body.token)
      errorRes = await request(server)
        .get("/api/users/100")
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

    describe("to get a nonexistent user", () => {
      it("responds with 'User with id _#_ not found'", () => {
        const expected = /user with id 100 not found/i
        expect(errorRes.body.message).toMatch(expected)
      })
      it("responds with the status code 404", () => {
        expect(errorRes.status).toBe(404)
      })
    })
  })

  runTokenTests("/api/users/1")

})

/* ========== [GET] - /api/users/:user_id/potlucks ========== */

describe("[GET] - /api/users/:user_id/potlucks", () => {
  describe("requesting with a valid token", () => {
    let res
    let errorRes
    beforeAll(async () => {
      const loginRes = await request(server)
        .post("/api/auth/login")
        .send({
          username: "meRRY",
          password: "1234"
        })
      res = await request(server)
        .get("/api/users/2/potlucks")
        .set("Authorization", loginRes.body.token)
      errorRes = await request(server)
        .get("/api/users/100/potlucks")
        .set("Authorization", loginRes.body.token)

    })
    it("responds with an array of potlucks organized by the selected user. If user has no potlucks, it responds with the message 'No potlucks found for User_ID _#_'", () => {
      const actual = res.body
      if (actual.length > 0 && actual[0].potluck_name) {
        actual.forEach(potluck => {
          expect(potluck).toHaveProperty("date")
          expect(potluck).toHaveProperty("location")
          expect(potluck).toHaveProperty("time")
          expect(potluck).toHaveProperty("potluck_name")
          expect(potluck).toHaveProperty("potluck_id")
          expect(potluck).toHaveProperty("user_id")
        })
      } else {
        expect(actual).toMatch(/no potlucks found for user_id 2/i)
      }
    })
    it("responds with the status code 200", () => {
      expect(res.status).toBe(200)
    })

    describe("to get a nonexistent user", () => {
      it("responds with 'User with id _#_ not found'", () => {
        const expected = /user with id 100 not found/i
        expect(errorRes.body.message).toMatch(expected)
      })
      it("responds with the status code 404", () => {
        expect(errorRes.status).toBe(404)
      })
    })
  })

  runTokenTests("/api/users/1")

})

/* ========== [POST] - /api/users/:user_id/potlucks ========== */

describe("[POST] - /api/users/:user_id/potlucks", () => {
  describe("requesting with a valid token", () => {
    let res
    let errorRes
    beforeAll(async () => {
      const loginRes = await request(server)
        .post("/api/auth/login")
        .send({
          username: "meRRY",
          password: "1234"
        })
      res = await request(server)
        .post("/api/users/2/potlucks")
        .send({
          potluck_name: "test",
          date: "1/2/3",
          time: "5:40 PM",
          location: "somewhere",
        })
        .set("Authorization", loginRes.body.token)
      errorRes = await request(server)
        .post("/api/users/100/potlucks")
        .send({
          garbage: "yes"
        })
        .set("Authorization", loginRes.body.token)
    })
    describe("to add a new potluck", () => {
      it("responds with the newly created potluck", () => {
        const actual = res.body
        expect(actual).toHaveProperty("date")
        expect(actual).toHaveProperty("location")
        expect(actual).toHaveProperty("time")
        expect(actual).toHaveProperty("potluck_name")
        expect(actual).toHaveProperty("potluck_id")
        expect(actual).toHaveProperty("user_id")
        expect(actual).toHaveProperty("guests")
      })
    })
    it("responds with the status code 201", () => {
      expect(res.status).toBe(201)
    })
  })

  runTokenTests("/api/users/1")

})
