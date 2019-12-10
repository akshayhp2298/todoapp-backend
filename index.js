require("dotenv").config()
const express = require("express")
const app = express()
const route = require("./Routes")
const PORT = process.env.PORT
const mongoose = require("mongoose")
const uri = process.env.URI
console.log("uri",PORT)

mongoose
  .connect(uri, { useNewUrlParser: true })
  .then(() => console.log("mongodb connected"))
  .catch(err => console.log(err))

app.use(route)
app.listen(PORT, err => {
  if (err) {
    console.log("Error occurred while starting the server")
    console.log(err)
  }
  console.log("Server running at post: ", PORT)
})
