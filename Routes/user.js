const Express = require("express")
const route = Express.Router()

route.get("/user", (req, res) => {
  res.send("in user route")
})


module.exports = route
