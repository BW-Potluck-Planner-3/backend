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
      expect(res.body).toHaveLength(2)
      expect(res.body[0] && res.body[1]).toHaveProperty("date")
      expect(res.body[0] && res.body[1]).toHaveProperty("location")
      expect(res.body[0] && res.body[1]).toHaveProperty("time")
      expect(res.body[0] && res.body[1]).toHaveProperty("potluck_name")
      expect(res.body[0] && res.body[1]).toHaveProperty("potluck_id")
      expect(res.body[0] && res.body[1]).toHaveProperty("user_id")
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
    describe("requesting a nonexistent potluck", () => {
      let res
      beforeEach(async () => {
        res = await request(server)
          .get("/api/potlucks/3")
          .set("Authorization", loginRes.body.token)
      })
      it("responds with 'potluck with id _#_ not found'", () => {
        const expected = /potluck with id 3 not found/i
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
        .get("/api/potlucks/:potluck_id")
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
      const expectedLength = 4
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
    describe("requesting guests from a nonexistent potluck", () => {
      let res
      beforeEach(async () => {
        res = await request(server)
          .get("/api/potlucks/3/guests")
          .set("Authorization", loginRes.body.token)
      })
      it("responds with 'potluck with id _#_ not found'", () => {
        const expected = /potluck with id 3 not found/i
        expect(res.body.message).toMatch(expected)
      })
      it("responds with the status code 404", () => {
        expect(res.status).toBe(404)
      })
    })
  })
})
