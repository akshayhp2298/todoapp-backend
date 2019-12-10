const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const Schema = mongoose.Schema
const jwt = require("jsonwebtoken")
const Joi = require("joi")
const status = Object.freeze({
  Done: "done",
  In_progress: "In-progress",
  Todo: "todo"
})
const todoSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    required: true
  },
  createdAt: {
    type: Number
  },
  status: {
    type: String,
    enum: Object.values(status)
  },
  path: {
    type: String
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
})

const Todos = mongoose.model("Todos", todoSchema)

function validateTodos(user) {
  const Schema = {
    title: Joi.string()
      .min(3)
      .max(50)
      .required(),
    desc: Joi.string()
      .min(5)
      .max(255)
      .required(),
    status: Joi.string().valid("todo","done","in-process")
      .min(3)
      .max(255)
      .required(),
    path: Joi.string()
      .min(4)
      .max(6)
  }
  return Joi.validate(user, Schema)
}

exports.Todos = Todos
exports.validate = validateTodos
