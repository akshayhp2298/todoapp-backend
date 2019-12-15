const request = require("supertest")
const app = require("../server")
describe("ping endpoint", () => {
  const signup = "/user/create"
  const signin = "/user/login"
  const self = "/user/self"
  const user = {
    email: `${Math.random()
      .toString(24)
      .slice(2)}@test.com`,
    password: "test",
    name: "test test"
  }
  let token
  it("should return 400 for invalid create user data", async () => {
    const res = await request(app)
      .post("/api/user/create")
      .send({ email: "sample@abc.com" })
    expect(res.statusCode).toBe(400)
    expect(res.body.isCreated).toBe(false)
  })
  it("should create user", async () => {
    const res = await request(app)
      .post("/api/user/create")
      .send(user)
    expect(res.statusCode).toBe(200)
    expect(res.body.done).toBe(true)
    expect(res.body).toHaveProperty("token")
  })
  it("should return email already exists", async () => {
    const res = await request(app)
      .post("/api/user/create")
      .send(user)
    expect(res.statusCode).toBe(409)
    expect(res.body.isCreated).toBe(false)
    expect(res.body.message).toBe("email already exists")
  })
  it("should return user not found", async () => {
    const res = await request(app)
      .post("/api/user/login")
      .send({ email: "no@email.com", password: "password" })
    expect(res.statusCode).toBe(404)
    expect(res.body.done).toBe(false)
    expect(res.body.message).toBe("user not found")
  })
  it("should return email or password invalid", async () => {
    const res = await request(app)
      .post("/api/user/login")
      .send({ email: user.email, password: "wrong" })
    expect(res.statusCode).toBe(401)
    expect(res.body.done).toBe(false)
    expect(res.body.message).toBe("email or password not valid")
  })
  it("should return token", async () => {
    const res = await request(app)
      .post("/api/user/login")
      .send({ email: user.email, password: user.password })
    expect(res.statusCode).toBe(200)
    expect(res.body.done).toBe(true)
    expect(res.body).toHaveProperty("token")
    token = res.body.token
  })
  it("should return unauthorized", async () => {
    const res = await request(app).get("/api/user/self")
    expect(res.statusCode).toBe(401)
  })
  it("should return unauthorized", async () => {
    const res = await request(app)
      .get("/api/user/self")
      .set({ Authorization: `${token}abc` })
    expect(res.statusCode).toBe(401)
  })
  it("should return user", async () => {
    const res = await request(app)
      .get("/api/user/self")
      .set({ Authorization: token })
    expect(res.statusCode).toBe(200)
    expect(res.body.done).toBe(true)
    expect(res.body.user).toHaveProperty("_id")
    expect(res.body.user).toHaveProperty("email")
    expect(res.body.user).toHaveProperty("name")
  })
  it("should delete user", async () => {
    const res = await request(app)
      .delete("/api/user/delete")
      .send({ email: user.email })
    expect(res.statusCode).toBe(200)
    expect(res.body.done).toBe(true)
    expect(res.body.message).toBe("User deleted")
  })
})
