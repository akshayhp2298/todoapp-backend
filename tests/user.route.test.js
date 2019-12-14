const request = require("supertest")
const app = require("../server")
describe("ping endpoint", () => {
  const signup = "/user/create"
  const signin = "/user/login"
  const self = "/user/self"
  const user = {
    email: "test@abc.com",
    password: "test",
    name: "test test"
  }
  const preSave = {
    email: "test@abc.com",
    password: "test"
  }
  let token
  it("should create user", async () => {
    const res = await request(app)
      .post("/api/user/create")
      .send(user)
    expect(res.statusCode).toBe(200)
    expect(res.body.done).toBe(true)
    expect(res.body).toHaveProperty('token')
  })
  it("should return email already exists", async () => {
    const res = await request(app)
      .post("/api/user/create")
      .send(user)
    expect(res.statusCode).toBe(409)
    expect(res.body.isCreated).toBe(false)
    expect(res.body.message).toBe('email already exists')
  })
  it("should return user not found", async () => {
    const res = await request(app)
      .post("/api/user/login")
      .send({email:'no@email.com',password:'password'})
    expect(res.statusCode).toBe(404)
    expect(res.body.done).toBe(false)
    expect(res.body.message).toBe('user not found')
  })
  it("should return email or password invalid", async () => {
    const res = await request(app)
      .post("/api/user/login")
      .send({...preSave,password:'wrong'})
    expect(res.statusCode).toBe(401)
    expect(res.body.done).toBe(false)
    expect(res.body.message).toBe('email or password not valid')
  })
  it("should return token", async () => {
    const res = await request(app)
      .post("/api/user/login")
      .send(preSave)
    expect(res.statusCode).toBe(200)
    expect(res.body.done).toBe(true)
    expect(res.body).toHaveProperty('token')
    token = res.body.token
  })
  it("should return unauthorized", async () => {
    const res = await request(app)
      .get("/api/user/self")
    expect(res.statusCode).toBe(401)
  })
  it("should return user", async () => {
    const res = await request(app)
      .get("/api/user/self")
      .set({'Authorization':token})
    expect(res.statusCode).toBe(200)
    expect(res.body.done).toBe(true)
    expect(res.body.user).toHaveProperty('_id')
    expect(res.body.user).toHaveProperty('email')
    expect(res.body.user).toHaveProperty('name')
  })

})
