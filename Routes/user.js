const Express = require("express")
const route = Express.Router()
const passport = require("passport")
const passportConf = require("../Auth/passport")

const {
  createUser,
  getSelf,
  validateLogin
} = require("../Controller/UserController")
route.post("/user/create", createUser)

route.get(
  "/user/self",
  passport.authenticate("jwt", { session: false }),
  getSelf
)

route.post("/user/login", validateLogin)

module.exports = route
