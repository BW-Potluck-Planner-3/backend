const request = require('supertest')
const server = require('../server')
const db = require('../data/db-config')

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

/* ========== [GET] - /api/potlucks ========== */

describe("[GET] - /api/potlucks", () => {
  describe("requesting with a valid token", () => {
    let res
    beforeEach(async () => {
      const loginRes = await request(server)
        .post("/api/auth/login")
        .send({
          username: "sam",
          password: "1234"
        })
      res = await request(server)
        .get("/api/potlucks")
        .set("Authorization", loginRes.body.token)
    })
    it("responds with an array of potlucks", () => {
      const actual = res.body
      expect(actual).toHaveLength(3)
      actual.forEach(potluck => {
        expect(potluck).toHaveProperty("date")
        expect(potluck).toHaveProperty("location")
        expect(potluck).toHaveProperty("time")
        expect(potluck).toHaveProperty("potluck_name")
        expect(potluck).toHaveProperty("potluck_id")
        expect(potluck).toHaveProperty("user_id")
      })
    })
    it("responds with the status code 200", () => {
      expect(res.status).toBe(200)
    })
  })

  describe("requesting with no token", () => {
    let res
    beforeEach(async () => {
      res = await request(server)
        .get("/api/potlucks")
    })
    it("responds with the message 'token required'", () => {
      const expected = /token required/i
      expect(res.body.message).toMatch(expected)
    })
    it("responds with the status code 401", () => {
      expect(res.status).toBe(401)
    })
  })

  describe("requesting with an invalid token", () => {
    let res
    beforeEach(async () => {
      res = await request(server)
        .get("/api/potlucks")
        .set("Authorization", "junk")
    })
    it("responds with the message 'invalid token'", () => {
      const expected = /invalid token/i
      expect(res.body.message).toMatch(expected)
    })
    it("responds with the status code 401", () => {
      expect(res.status).toBe(401)
    })
  })
})

/* ========== [GET] - /api/potlucks/:potluck_id ========== */

describe("[GET] - /api/potlucks/:potluck_id", () => {
  describe("requesting with a valid token", () => {
    let loginRes
    beforeEach(async () => {
      loginRes = await request(server)
        .post("/api/auth/login")
        .send({
          username: "PiPPiN",
          password: "1234"
        })
    })
    it("responds with a single potluck object", async () => {
      const res = await request(server)
        .get("/api/potlucks/2")
        .set("Authorization", loginRes.body.token)
      expect(res.body).toHaveProperty("date")
      expect(res.body).toHaveProperty("location")
      expect(res.body).toHaveProperty("time")
      expect(res.body).toHaveProperty("potluck_name")
      expect(res.body).toHaveProperty("potluck_id", 2)
      expect(res.body).toHaveProperty("user_id", 3)
    })
    it("responds with the status code 200", async () => {
      const res = await request(server)
        .get("/api/potlucks/2")
        .set("Authorization", loginRes.body.token)
      expect(res.status).toBe(200)
    })

    describe("to get a nonexistent potluck", () => {
      let res
      beforeEach(async () => {
        res = await request(server)
          .get("/api/potlucks/8")
          .set("Authorization", loginRes.body.token)
      })
      it("responds with 'potluck with id _#_ not found'", () => {
        const expected = /potluck with id 8 not found/i
        expect(res.body.message).toMatch(expected)
      })
      it("responds with the status code 404", () => {
        expect(res.status).toBe(404)
      })
    })
  })

  describe("requesting with no token", () => {
    let res
    beforeEach(async () => {
      res = await request(server)
        .get("/api/potlucks/2")
    })
    it("responds with the message 'token required'", () => {
      const expected = /token required/i
      expect(res.body.message).toMatch(expected)
    })
    it("responds with the status code 401", () => {
      expect(res.status).toBe(401)
    })
  })

  describe("requesting with an invalid token", () => {
    let res
    beforeEach(async () => {
      res = await request(server)
        .get("/api/potlucks/2")
        .set("Authorization", "megaJunk")
    })
    it("responds with the message 'invalid token'", () => {
      const expected = /invalid token/i
      expect(res.body.message).toMatch(expected)
    })
    it("responds with the status code 401", () => {
      expect(res.status).toBe(401)
    })
  })
})

/* ========== [GET] - /api/potlucks/:potluck_id/guests ========== */

describe("[GET] - /api/potlucks/:potluck_id/guests", () => {
  describe("requesting with a valid token", () => {
    let loginRes
    beforeEach(async () => {
      loginRes = await request(server)
        .post("/api/auth/login")
        .send({
          username: "FrOdO",
          password: "1234"
        })
    })
    it("responds with an array containing guests objects connected to the specified potluck", async () => {
      const res = await request(server)
        .get("/api/potlucks/1/guests")
        .set("Authorization", loginRes.body.token)
      const expectedLength = 3
      const actual = res.body
      expect(actual).toHaveLength(expectedLength)
      actual.forEach(guest => {
        expect(guest).toHaveProperty("user_id")
        expect(guest).toHaveProperty("attending")
        expect(guest).toHaveProperty("username")
      })
    })
    it("responds with the status code 200", async () => {
      const res = await request(server)
        .get("/api/potlucks/1/guests")
        .set("Authorization", loginRes.body.token)
      expect(res.status).toBe(200)
    })

    describe("to get guests from a nonexistent potluck", () => {
      let res
      beforeEach(async () => {
        res = await request(server)
          .get("/api/potlucks/8/guests")
          .set("Authorization", loginRes.body.token)
      })
      it("responds with 'potluck with id _#_ not found'", () => {
        const expected = /potluck with id 8 not found/i
        expect(res.body.message).toMatch(expected)
      })
      it("responds with the status code 404", () => {
        expect(res.status).toBe(404)
      })
    })
  })

  describe("requesting with no token", () => {
    let res
    beforeEach(async () => {
      res = await request(server)
        .get("/api/potlucks/1/guests")
    })
    it("responds with the message 'token required'", () => {
      const expected = /token required/i
      expect(res.body.message).toMatch(expected)
    })
    it("responds with the status code 401", () => {
      expect(res.status).toBe(401)
    })
  })

  describe("requesting with an invalid token", () => {
    let res
    beforeEach(async () => {
      res = await request(server)
        .get("/api/potlucks/1/guests")
        .set("Authorization", "megaJunk")
    })
    it("responds with the message 'invalid token'", () => {
      const expected = /invalid token/i
      expect(res.body.message).toMatch(expected)
    })
    it("responds with the status code 401", () => {
      expect(res.status).toBe(401)
    })
  })
})

/* ========== [GET] - /api/potlucks/:potluck_id/foods ========== */

describe("[GET] - /api/potlucks/:potluck_id/foods", () => {
  describe("requesting with a valid token", () => {
    let loginRes
    beforeEach(async () => {
      loginRes = await request(server)
        .post("/api/auth/login")
        .send({
          username: "meRRy",
          password: "1234"
        })
    })
    it("responds with an array containing food objects connected to the specified potluck", async () => {
      const res = await request(server)
        .get("/api/potlucks/1/foods")
        .set("Authorization", loginRes.body.token)
      const expectedLength = 3
      const actual = res.body
      expect(actual).toHaveLength(expectedLength)
      actual.forEach(food => {
        expect(food).toHaveProperty("food_name")
        expect(food).toHaveProperty("user_id")
        expect(food).toHaveProperty("username")
      })
    })
    it("responds with the status code 200", async () => {
      const res = await request(server)
        .get("/api/potlucks/1/foods")
        .set("Authorization", loginRes.body.token)
      expect(res.status).toBe(200)
    })

    describe("foods from a nonexistent potluck", () => {
      let res
      beforeAll(async () => {
        res = await request(server)
          .get("/api/potlucks/8/foods")
          .set("Authorization", loginRes.body.token)
      })
      it("responds with 'potluck with id _#_ not found'", () => {
        const expected = /potluck with id 8 not found/i
        expect(res.body.message).toMatch(expected)
      })
      it("responds with the status code 404", () => {
        expect(res.status).toBe(404)
      })
    })
  })

  describe("requesting with no token", () => {
    let res
    beforeAll(async () => {
      res = await request(server)
        .get("/api/potlucks/1/foods")
    })
    it("responds with the message 'token required'", () => {
      const expected = /token required/i
      expect(res.body.message).toMatch(expected)
    })
    it("responds with the status code 401", () => {
      expect(res.status).toBe(401)
    })
  })

  describe("requesting with an invalid token", () => {
    let res
    beforeAll(async () => {
      res = await request(server)
        .get("/api/potlucks/1/foods")
        .set("Authorization", "ultraJunk")
    })
    it("responds with the message 'invalid token'", () => {
      const expected = /invalid token/i
      expect(res.body.message).toMatch(expected)
    })
    it("responds with the status code 401", () => {
      expect(res.status).toBe(401)
    })
  })
})

/* ========== [POST] - /api/potlucks/:potluck_id/guests ========== */

describe("[POST] - /api/potlucks/:potluck_id/guests", () => {
  describe("requesting with a valid token", () => {
    let res
    beforeAll(async () => {
      const loginRes = await request(server)
        .post("/api/auth/login")
        .send({
          username: "SaM",
          password: "1234"
        })
      res = await request(server)
        .post("/api/potlucks/3/guests")
        .set("Authorization", loginRes.body.token)
        .send({
          user_id: 3,
          attending: true
        })
    })
    describe("to add a valid guest to a potluck", () => {
      it("resonds with an array containing all of the guests, who have been invited to this potluck", async () => {
        const actual = res.body
        expect(actual).toHaveLength(1)
        actual.forEach(guest => {
          expect(guest).toHaveProperty("user_id")
          expect(guest).toHaveProperty("username")
          expect(guest).toHaveProperty("attending")
        })
      })
      it("responds with the status code 201", async () => {
        expect(res.status).toBe(201)
      })
    })

    describe("to add a guest to a nonexistent potluck", () => {
      let res
      beforeAll(async () => {
        const loginRes = await request(server)
          .post("/api/auth/login")
          .send({
            username: "SaM",
            password: "1234"
          })
        res = await request(server)
          .post("/api/potlucks/8/guests")
          .set("Authorization", loginRes.body.token)
          .send({
            user_id: 3,
            attending: false
          })
      })
      it("responds with 'potluck with id _#_ not found'", () => {
        const expected = /potluck with id 8 not found/i
        expect(res.body.message).toMatch(expected)
      })
      it("responds with the status code 404", () => {
        expect(res.status).toBe(404)
      })
    })

    describe("to add a guest with bad request body", () => {
      let res
      beforeAll(async () => {
        const loginRes = await request(server)
          .post("/api/auth/login")
          .send({
            username: "SaM",
            password: "1234"
          })
        res = await request(server)
          .post("/api/potlucks/2/guests")
          .set("Authorization", loginRes.body.token)
          .send({
            bad: "apple"
          })
      })
      it("responds with 'Please provide a user_id and an attending boolean'", () => {
        const expected = /Please provide a user_id and an attending boolean/i
        expect(res.body.message).toMatch(expected)
      })
      it("responds with the status code 400", () => {
        expect(res.status).toBe(400)
      })
    })

    describe("to add the organizer of the potluck as their own guest", () => {
      let res
      beforeAll(async () => {
        const loginRes = await request(server)
          .post("/api/auth/login")
          .send({
            username: "sam",
            password: "1234"
          })
        res = await request(server)
          .post("/api/potlucks/3/guests")
          .set("Authorization", loginRes.body.token)
          .send({
            user_id: 5,
            attending: true
          })
      })
      it("responds with 'Cannot add a potluck organizer as their own guest'", () => {
        const expected = /cannot add a potluck organizer as their own guest/i
        expect(res.body.message).toMatch(expected)
      })
      it("responds with the status code 400", () => {
        expect(res.status).toBe(400)
      })
    })
  })
})
