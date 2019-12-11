const express = require("express")
var cors = require('cors')
const morgan = require("morgan")
const user = require("./user")
const todos = require("./todos")
const app = express()
const routes = [user, todos]
app.use(express.json())
app.use(cors())

app.use(morgan("tiny"))

routes.forEach(route => {
  app.use("/api", route)
})

module.exports = app
