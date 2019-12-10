const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const user = require("./user")

const app = express()
const routes = [user]
app.use(express.json())
app.use(cors())
app.use(morgan("tiny"))

routes.forEach(route => {
  app.use("/api", route)
})

module.exports = app
