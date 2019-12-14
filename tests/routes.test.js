const request = require("supertest")
const app = require("../server")
describe("ping endpoint", () => {
  it("should check for connection to server", async () => {
    const res = await request(app).get("/ping")
    expect(res.statusCode).toBe(200)
    expect(res.body.done).toBe(true)
    expect(res.body.message).toBe('working')
  })
})
