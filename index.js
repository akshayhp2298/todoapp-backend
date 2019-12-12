require("dotenv").config()
const express = require("express")
const PORT = process.env.PORT
const mongoose = require("mongoose")
const uri = process.env.URI
const user = require("./Routes/user")
const todos = require("./Routes/todos")
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const routes = [user, todos]
app.use(cors())
app.use(morgan('tiny'))
app.use(express.json())

mongoose
  .connect(uri, { useNewUrlParser: true })
  .then(() => console.log("mongodb connected"))
  .catch(err => console.log(err))

app.get("/ping",(req,res)=>res.send({done:true,message:"working"}))

routes.forEach(route => {
  app.use("/api", route)
})
app.listen(PORT, err => {
  if (err) {
    console.log("Error occurred while starting the server")
    console.log(err)
  }
  console.log("Server running at post: ", PORT)
})
