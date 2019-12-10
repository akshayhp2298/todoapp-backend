const { User, validate } = require("../Models/User")
const bcrypt = require("bcrypt")

//create User
const createUser = async (req, res) => {
  //check data for any errors
  const { error } = validate(req.body)
  //return error
  if (error)
    res
      .status(400)
      .send({ isCreated: false, message: error.details[0].message })
  //check any user exists or not
  let user = await User.findOne({ email: req.body.email })
  //if user found then return error
  if (user)
    res.status(400).send({ isCreated: false, message: "email already exists" })
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
}
module.exports.createUser = createUser

//get self user data
const getSelf = async (req, res) => {
  //check if user is there in req or not (user added from passport Auth check via token)
  if (!req.user) {
    res.send({ done: false, message: "something went wrong" })
    return
  }
  //create user object
  const { name, email, gender } = req.user
  const user = { name, email, gender }
  //send response with user
  res.status(200).send({ done: true, user })
}
module.exports.getSelf = getSelf

//validate email and password for login
module.exports.validateLogin = async (req, res) => {
  const { email, password } = req.body
  //get user with email
  const user = await User.findOne({ email })
  //if use not found return
  if (!user) {
    res
      .status(404)
      .send({ done: false, message: "email or password not valid" })
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
}
