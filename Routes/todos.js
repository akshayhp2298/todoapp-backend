const Express = require("express")
const route = Express.Router()
const passport = require("passport")
const passportConf = require("../Auth/passport")
const {
  createTodo,
  getAllTodos,
  updateTodo,
  dateSortedTodos,
  deleteTodo,
  deleteManyTodo,
  getOneTodo
} = require("../Controller/TodoController")
route.get(
  "/todos/get/all",
  passport.authenticate("jwt", { session: false }),
  getAllTodos
)

route.get(
  "/todos/get/one/:id",
  passport.authenticate("jwt", { session: false }),
  getOneTodo
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

route.put(
  "/todos/update/:id",
  passport.authenticate("jwt", { session: false }),
  updateTodo
)

route.delete(
  "/todos/delete",
  passport.authenticate("jwt", { session: false }),
  deleteTodo
)

route.delete(
  "/todos/delete/many",
  passport.authenticate("jwt", { session: false }),
  deleteManyTodo
)

module.exports = route
