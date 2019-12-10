require("dotenv")
const express = require("express")
const app = express()
const route = require("./Routes")
const PORT = process.env.PORT
app.use(route)
app.listen(PORT, err => {
  if (err) {
    console.log("Error occurred while starting the server")
    console.log(err)
  }
  console.log("Server running at post: ", PORT)
})
