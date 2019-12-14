const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const Schema = mongoose.Schema
const jwt = require("jsonwebtoken")
const Joi = require("joi")
const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  gender: {
    type: String
  }
})
userSchema.methods.isValidPassword = async function(pass) {
  try {
    let status
    await bcrypt.compare(pass, this.password).then(function(res) {
      if (res) {
        status = true
      }
    })
    return status
  } catch (error) {
    throw new Error(error)
  }
}

userSchema.methods.getName = function() {
  return this.name
}
userSchema.methods.generateToken = function() {
  return jwt.sign({ user: this }, process.env.secretKey)
}
const User = mongoose.model("User", userSchema)

function validateUser(user) {
  const Schema = {
    name: Joi.string()
      .min(3)
      .max(50)
      .required(),
    email: Joi.string()
      .min(5)
      .max(255)
      .required()
      .email(),
    password: Joi.string()
      .min(3)
      .max(255)
      .required(),
    gender: Joi.string()
      .min(4)
      .max(6)
  }
  return Joi.validate(user, Schema)
}

exports.User = User
exports.validate = validateUser
