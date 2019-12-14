const request = require("supertest")
const app = require("../server")
describe("ping endpoint", () => {
  const signup = "/user/create"
  const signin = "/user/login"
  const self = "/user/self"
  const user = {
    email: "test2@abc.com",
    password: "test",
    name: "test2 test2"
  }
  let todo
  const preSave = {
    title: "some title",
    desc: "some desc",
    status: "todo",
    targetDate: 1576292950982
  }
  let token
  it("should create user", async () => {
    const res = await request(app)
      .post("/api/user/create")
      .send(user)
    expect(res.statusCode).toBe(200)
    expect(res.body.done).toBe(true)
    expect(res.body).toHaveProperty("token")
  })
  it("should return token", async () => {
    const res = await request(app)
      .post("/api/user/login")
      .send({ email: "test2@abc.com", password: "test" })
    expect(res.statusCode).toBe(200)
    expect(res.body.done).toBe(true)
    expect(res.body).toHaveProperty("token")
    token = res.body.token
  })
  it("should return unauthorized", async () => {
    const res = await request(app)
      .post("/api/todos/create")
      .send(preSave)
    expect(res.statusCode).toBe(401)
  })
  it("should return invalid date of todo", async () => {
    const res = await request(app)
      .post("/api/todos/create")
      .send({})
      .set({ Authorization: token })
    expect(res.statusCode).toBe(400)
    expect(res.body.done).toBe(false)
  })
  it("should create todo", async () => {
    const res = await request(app)
      .post("/api/todos/create")
      .send(preSave)
      .set({ Authorization: token })
    expect(res.statusCode).toBe(200)
    expect(res.body.done).toBe(true)
    expect(res.body).toHaveProperty("todo")
    todo = res.body.todo
  })
  it("should get all todo", async () => {
    const res = await request(app)
      .get("/api/todos/get/all")
      .set({ Authorization: token })
    expect(res.statusCode).toBe(200)
    expect(res.body.done).toBe(true)
    expect(res.body).toHaveProperty("todos")
  })
  it("should unauthorized for one todo", async () => {
    const res = await request(app).get(`/api/todos/get/one/${todo._id}`)
    expect(res.statusCode).toBe(401)
  })
  it("should get one todo", async () => {
    const res = await request(app)
      .get(`/api/todos/get/one/${todo._id}`)
      .set({ Authorization: token })
    expect(res.statusCode).toBe(200)
    expect(res.body.done).toBe(true)
    expect(res.body).toHaveProperty("todo")
    todo = res.body.todo
  })
  it("should return unauthorized for update todo", async () => {
    const res = await request(app)
      .put(`/api/todos/update/${todo._id}`)
      .send({ ...todo, title: "title changed" })
    expect(res.statusCode).toBe(401)
  })
  it("should update todo", async () => {
    const res = await request(app)
      .put(`/api/todos/update/${todo._id}`)
      .send({ ...todo, title: "title changed" })
      .set({ Authorization: token })
    expect(res.statusCode).toBe(200)
    expect(res.body.done).toBe(true)
    expect(res.body).toHaveProperty("todo")
    todo = res.body.todo
  })
  it("should return unauthorized for delete todo", async () => {
    const res = await request(app)
      .delete(`/api/todos/delete`)
      .send({ _id: todo._id })
    expect(res.statusCode).toBe(401)
  })
  it("should return id not found for delete todo", async () => {
    const res = await request(app)
      .delete(`/api/todos/delete`)
      .send({})
      .set({ Authorization: token })
    expect(res.statusCode).toBe(404)
    expect(res.body.done).toBe(false)
    expect(res.body.message).toBe("id not found")
  })
  it("should delete todo", async () => {
    const res = await request(app)
      .delete(`/api/todos/delete`)
      .send({ _id: todo._id })
      .set({ Authorization: token })
    expect(res.statusCode).toBe(200)
    expect(res.body.done).toBe(true)
    expect(res.body.message).toBe("deleted successfully")
  })
})
