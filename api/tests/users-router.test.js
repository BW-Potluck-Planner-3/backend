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

function getReqTokenTests(endpointPath) {
  return (
    describe("Token Tests:", () => {
      describe("requesting with no token", () => {
        let res
        beforeAll(async () => {
          res = await request(server)
            .get(`${endpointPath}`)
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
            .get(`${endpointPath}`)
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
  )
}

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
  // Token Tests
  getReqTokenTests("/api/users")
})
