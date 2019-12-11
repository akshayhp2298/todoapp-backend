const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const user = require("./user")
const todos = require("./todos")
const app = express()
const routes = [user, todos]
app.use(express.json())
app.use(cors())
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});
app.use(morgan("tiny"))

routes.forEach(route => {
  app.use("/api", route)
})

module.exports = app
