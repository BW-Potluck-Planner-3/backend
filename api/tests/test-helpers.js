const request = require('supertest')
const server = require('../server')

function getReqTokenTests(endpointPath) {
  return (
    describe("Bad/Missing Token Tests:", () => {
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

function postReqTokenTests(endpointPath, sentObject) {
  return (
    describe("Bad/Missing Token Tests:", () => {
      describe("requesting with no token", () => {
        let res
        beforeAll(async () => {
          res = await request(server)
            .post(`${endpointPath}`)
            .send(sentObject)
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

module.exports = {
  getReqTokenTests,
  postReqTokenTests
}
