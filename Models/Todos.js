const mongoose = require("mongoose")
const Schema = mongoose.Schema
const Joi = require("joi")
const status = Object.freeze({
  Done: "done",
  In_progress: "in-process",
  Todo: "todo"
})
const type = Object.freeze({
  Image: "image",
  Video: "video",
  "":""
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
  type: {
    type: String,
    enum: Object.values(type)
  },
  path: {
    type: String
  },
  targetDate: {
    type: Number
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
    status: Joi.string()
      .valid("todo", "done", "in-process")
      .min(3)
      .max(255)
      .required(),
    type: Joi.string().valid("image", "video").allow(""),
    path: Joi.string().allow(""),
    targetDate: Joi.number().required()
  }
  return Joi.validate(user, Schema)
}

exports.Todos = Todos
exports.validate = validateTodos
