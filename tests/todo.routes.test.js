const request = require("supertest")
const app = require("../server")
describe("ping endpoint", () => {
  const user = {
    email: `${Math.random().toString(24).slice(2)}@test.com`,
    password: "test",
    name: "test2 test2"
  }
  let todo
  let ids = []
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
      .send({ email: user.email, password: "test" })
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
  it("should create todo with image path", async () => {
    const res = await request(app)
      .post("/api/todos/create")
      .send({ ...preSave, type: "image", path: "somepath" })
      .set({ Authorization: token })
    expect(res.statusCode).toBe(200)
    expect(res.body.done).toBe(true)
    expect(res.body).toHaveProperty("todo")
    ids.push(res.body.todo._id)
  })
  it("should create todo with video path", async () => {
    const res = await request(app)
      .post("/api/todos/create")
      .send({ ...preSave, type: "video", path: "somepath" })
      .set({ Authorization: token })
    expect(res.statusCode).toBe(200)
    expect(res.body.done).toBe(true)
    expect(res.body).toHaveProperty("todo")
    ids.push(res.body.todo._id)
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
  it("should return 404 for get one todo without id", async () => {
    const res = await request(app)
      .get(`/api/todos/get/one`)
      .set({ Authorization: token })
    expect(res.statusCode).toBe(404)
  })
  it("should return bad request invalid id", async () => {
    const res = await request(app)
      .get(`/api/todos/get/one/${todo._id}abc`)
      .set({ Authorization: token })
    expect(res.statusCode).toBe(400)
    expect(res.body.done).toBe(false)
  })
  it("should return not found for get one todo", async () => {
    let id = todo._id.replace(todo._id.charAt(0), "a")
    const res = await request(app)
      .get(`/api/todos/get/one/${id}`)
      .set({ Authorization: token })
    expect(res.statusCode).toBe(404)
    expect(res.body.done).toBe(false)
    expect(res.body.message).toBe("Not found")
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
  it("should return bad request for update todo", async () => {
    let id = todo._id.replace(todo._id.charAt(0), "a")
    const res = await request(app)
      .put(`/api/todos/update/${id}`)
      .send({ ...todo, title: "title changed" })
      .set({ Authorization: token })
    expect(res.statusCode).toBe(400)
    expect(res.body.done).toBe(false)
  })
  it("should return 404 id not found for update todo", async () => {
    const res = await request(app)
      .put(`/api/todos/update/${todo._id}`)
      .send({})
      .set({ Authorization: token })
    expect(res.statusCode).toBe(404)
    expect(res.body.done).toBe(false)
    expect(res.body.message).toBe("Id not found")
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
  it("should return bad request for delete todo", async () => {
    let id = todo._id + "a"
    const res = await request(app)
      .delete(`/api/todos/delete`)
      .send({ _id: id })
      .set({ Authorization: token })
    expect(res.statusCode).toBe(400)
    expect(res.body.done).toBe(false)
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
  it("should return 404 for delete many todos", async () => {
    const res = await request(app)
      .delete(`/api/todos/delete/many`)
      .send()
      .set({ Authorization: token })
    expect(res.statusCode).toBe(404)
    expect(res.body.done).toBe(false)
  })
  it("should return bad request for delete many todo", async () => {
    let id = todo._id + "a"
    let manyIds = []
    manyIds.push(id)
    const res = await request(app)
      .delete("/api/todos/delete/many")
      .send({ ids: manyIds })
      .set({ Authorization: token })
    expect(res.statusCode).toBe(400)
    expect(res.body.done).toBe(false)
  })
  it("should delete many todos", async () => {
    const res = await request(app)
      .delete("/api/todos/delete/many")
      .send({ ids })
      .set({ Authorization: token })
    expect(res.statusCode).toBe(200)
    expect(res.body.done).toBe(true)
    expect(res.body.message).toBe("deleted successfully")
  })
  it("should delete user",async()=>{
    const res = await request(app)
    .delete("/api/user/delete")
    .send({email:user.email})
    expect(res.statusCode).toBe(200)
    expect(res.body.done).toBe(true)
    expect(res.body.message).toBe("User deleted")
  })
})
