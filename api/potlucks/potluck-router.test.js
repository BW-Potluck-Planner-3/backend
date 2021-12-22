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

describe("[GET] /api/potlucks", () => {
  describe("success", () => {
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
    it("responds with an array of potlucks if request headers authorization is valid", () => {
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
  describe("token required", () => {
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
  describe("invalid token", () => {
    let res
    beforeEach(async () => {
      res = await request(server)
        .get("/api/potlucks")
        .set("Authorization", "junk")
    })
    it("responds with the message 'token required'", () => {
      const expected = /invalid token/i
      expect(res.body.message).toMatch(expected)
    })
    it("responds with the status code 401", () => {
      expect(res.status).toBe(401)
    })
  })
})
