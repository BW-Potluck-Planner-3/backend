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

describe("[POST] /api/auth/login", () => {
  it('responds with the message "welcome back" and status code 200 if login request is successful', async () => {
    const expectedMessage = /welcome back/i
    const res = await request(server)
      .post("/api/auth/login")
      .send({
        username: "frodo",
        password: "1234"
      })
    expect(res.status).toBe(200)
    expect(res.body.message).toMatch(expectedMessage)
  })
  it('responds with a token if login request is successful', async () => {
    const res = await request(server)
      .post("/api/auth/login")
      .send({
        username: "sam",
        password: "1234"
      })
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty("token")
  })
  it('responds with the message "invalid credentials" and status code 401 if login request is invalid', async () => {
    const expectedMessage = /invalid credentials/i
    const res = await request(server)
      .post("/api/auth/login")
      .send({
        username: "sam",
        password: "abcd"
      })
    expect(res.status).toBe(401)
    expect(res.body.message).toMatch(expectedMessage)
  })
})
