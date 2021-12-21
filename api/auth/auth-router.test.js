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
  it('responds with the message "successfully registered {username}" and status code 201 if inputs are valid', async () => {
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
  it('responds with the message "username already exists" and status code 401 if the request body\'s username already exists', async () => {
    const expectedMessage = /username already exists/i
    const res = await request(server)
      .post('/api/auth/register')
      .send({
        username: "frodo",
        password: "1234"
      })
    expect(res.status).toBe(401)
    expect(res.body.message).toMatch(expectedMessage)
  })
  it('responds with the message "username and password required" and status code 401 if the request body lacks either a username or password', async () => {
    const expectedMessage = /username and password required/i
    const res = await request(server)
      .post("/api/auth/register")
      .send({
        username: "",
        password: "bad"
      })
    expect(res.status).toBe(401)
    expect(res.body.message).toMatch(expectedMessage)
  })
})
