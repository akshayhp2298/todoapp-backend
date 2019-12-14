require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const uri = process.env.URI
const user = require("./Routes/user")
const todos = require("./Routes/todos")
const app = express()
const morgan = require("morgan")
const cors = require("cors")
const routes = [user, todos]
app.use(cors())

if (process.env.NODE_ENV !== "test") app.use(morgan("tiny"))
app.use(express.json())

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .catch(err => console.log(err))

app.get("/ping", (req, res) => res.send({ done: true, message: "working" }))

routes.forEach(route => {
  app.use("/api", route)
})

module.exports = app
