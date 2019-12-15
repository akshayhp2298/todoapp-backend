const { User, validate } = require("../Models/User")
const bcrypt = require("bcrypt")

//create User
module.exports.createUser = async (req, res) => {
  try {
    //check data for any errors
    const { error } = validate(req.body)
    //return error
    if (error) {
      res
        .status(400)
        .send({ isCreated: false, message: error.details[0].message })
      return
    }
    //check any user exists or not
    let user = await User.findOne({ email: req.body.email })
    //if user found then return error
    if (user) {
      res
        .status(409)
        .send({ isCreated: false, message: "email already exists" })
      return
    }
    //create user
    user = new User({
      name: req.body.name,
      password: req.body.password,
      email: req.body.email,
      gender: req.body.gender || ""
    })
    //encrypt password with bcrypt
    user.password = await bcrypt.hash(user.password, 10)
    //save user in mongodb
    await user.save()
    //generate token for user
    const token = user.generateToken()
    //return token
    res.status(200).send({ done: true, token })
  } catch (Exception) {
    res.send(400).send({ done: false, message: Exception.message })
  }
}

//get self user data
module.exports.getSelf = async (req, res) => {
  try {
    //create user object
    const { _id, name, email, gender } = req.user
    const user = { _id, name, email, gender }
    //send response with user
    res.status(200).send({ done: true, user })
  } catch (Exception) {
    res.send({ done: false, message: Exception.message })
  }
}

//validate email and password for login
module.exports.validateLogin = async (req, res) => {
  try {
    const { email, password } = req.body
    //get user with email
    const user = await User.findOne({ email })
    //if use not found return
    if (!user) {
      res.status(404).send({ done: false, message: "user not found" })
      return
    }
    //check password
    const status = await user.isValidPassword(password)
    //if password match return token or return error
    if (status) {
      const token = user.generateToken(user.id)
      res.status(200).send({ done: true, token })
    } else
      res
        .status(401)
        .send({ done: false, message: "email or password not valid" })
  } catch (Exception) {
    res.send({ done: false, message: Exception.message })
  }
}

//delete user
module.exports.deleteUser = async (req, res) => {
  try {
    const email = req.body.email
    await User.findOneAndDelete(email)
    res.send({ done: true, message: "User deleted" })
  } catch (Exception) {
    console.log(Exception.message)
  }
}
