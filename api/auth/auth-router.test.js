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

describe("[POST] /api/auth/register", () => {
  it("responds with success message and status code 201 if inputs are valid", async () => {
    const expectedMessage = /successfully registered/i
    const res = await request(server)
      .post('/api/auth/register')
      .send({
        username: "Alfred9000",
        password: "abc123"
      })
    expect(res.status).toBe(201)
    expect(res.body.message).toMatch(expectedMessage)
  })
  // it('responds with { message: "username and password required" } and status code 400 if the request body does not contain either a username or password key with a value', async () => {
  //   const res = await request(server)
  //     .post('/api/auth/register')
  //     .send({
  //       username: "",
  //       password: "1234"
  //     })
  //   expect(res.status).toBe(400)
  //   expect(res.body).toMatchObject({
  //     message: "username and password required"
  //   })
  // })
  // it('responds with { message: "username taken" } and status code 409 if the username in the request body already exists in the database', async () => {
  //   const res = await request(server)
  //     .post("/api/auth/register")
  //     .send({
  //       username: "eli_the_lion",
  //       password: "1234"
  //     })
  //   expect(res.status).toBe(409)
  //   expect(res.body).toMatchObject({
  //     message: "username taken"
  //   })
  // })
})
