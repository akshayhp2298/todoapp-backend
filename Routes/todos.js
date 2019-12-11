const Express = require("express")
const route = Express.Router()
const passport = require("passport")
const passportConf = require("../Auth/passport")
const {
  createTodo,
  getAllTodos,
  updateTodo,
  dateSortedTodos
} = require("../Controller/TodoController")
route.get(
  "/todos/get/all",
  passport.authenticate("jwt", { session: false }),
  getAllTodos
)

route.get(
  "/todos/get/all/sort/by/date",
  passport.authenticate("jwt", { session: false }),
  dateSortedTodos
)

route.get("/todos/get/by/one", passport.authenticate("jwt", { session: false }))

route.post(
  "/todos/create",
  passport.authenticate("jwt", { session: false }),
  createTodo
)

route.post(
  "/todos/update",
  passport.authenticate("jwt", { session: false }),
  updateTodo
)

module.exports = route
