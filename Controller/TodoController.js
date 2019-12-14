const { Todos, validate } = require("../Models/Todos")

//get all todos of user
module.exports.getAllTodos = async (req, res) => {
  try {
    //get userid from req.user and get all todos of that user
    const range = req.query.range ? JSON.parse(req.query.range) : []
    const sort = req.query.sort ? JSON.parse(req.query.sort) : []
    const filter = req.query.filter ? JSON.parse(req.query.filter) : {}
    const total = await Todos.countDocuments({
      user: req.user._id,
      title: { $regex: `.*${filter.title || ""}.*`, $options: "-i" },
      desc: { $regex: `.*${filter.desc || ""}.*`, $options: "-i" }
    })
    const todos = await Todos.find({
      user: req.user._id,
      title: { $regex: `.*${filter.title || ""}.*`, $options: "-i" },
      desc: { $regex: `.*${filter.desc || ""}.*`, $options: "-i" }
    })
      .sort([[sort[0], sort[1] === "ASC" ? 1 : -1]])
      .skip(range[0])
      .limit(range[1] - range[0] + 1)
    res.status(200).send({ done: true, todos, total })
  } catch (Exception) {
    res.status(500).send({ done: false, message: Exception.message })
  }
}

//create a record of todo
module.exports.createTodo = async (req, res) => {
  try {
    // validate data
    const { error } = validate(req.body)
    //return if data is not valid
    if (error) {
      res.status(400).send({ done: false, message: error.details[0].message })
      return
    }
    //creating an object of todo
    const { title, desc, status, targetDate } = req.body
    const type = req.body.type || ""
    const path = req.body.path || ""
    let todo = new Todos({
      title,
      desc,
      status,
      type,
      path,
      targetDate,
      createdAt: Date.now(),
      user: req.user._id
    })
    //save in mongodb and return to response
    await todo.save()
    res.status(200).send({ done: true, todo })
  } catch (Exception) {
    console.log(Exception.message)
    res.status(500).send({ done: false, message: Exception.message })
  }
}

//update todo
module.exports.updateTodo = async (req, res) => {
  try {
    //checking for id in request body
    const _id = req.params.id
    const { user } = req.body
    if (!_id && !user) {
      res.status(404).send({ done: false, message: "Id not found" })
    }
    //check ownership of todo
    if (user != req.user._id) {
      res.status(401).send({ done: false, message: "Unauthorized" })
      return
    }
    //get todo from mongodb
    let todo = await Todos.findById(_id)
    //update todo
    let todoUpdate = await Todos.findByIdAndUpdate(_id, {
      title: req.body.title || todo.title,
      desc: req.body.desc || todo.desc,
      status: req.body.status || todo.status,
      type: req.body.type || todo.type || "",
      path: req.body.path || todo.path || "",
      targetDate: req.body.targetDate || todo.targetDate
    })
    res.send({ done: true, message: "Updated successfully", todo: todoUpdate })
  } catch (Exception) {
    res.send({ done: false, message: Exception.message })
  }
}

//delete todo
module.exports.deleteTodo = async (req, res) => {
  try {
    //get id of todo
    const id = req.body._id
    if (!id) {
      res.status(404).send({ done: false, message: "id not found" })
      return
    }
    //deleting record
    await Todos.findOneAndDelete({ _id: id, user: req.user._id })
    res.status(200).send({ done: true, message: "deleted successfully" })
  } catch (Exception) {
    res.send({ done: false, message: Exception.message })
  }
}

//delete many todo
module.exports.deleteManyTodo = async (req, res) => {
  try {
    //get ids from request
    const ids = req.body.ids
    if (!ids) {
      res.status(404).send({ done: false, message: "id not found" })
    }
    //delete many with match of id and user
    await Todos.deleteMany({ _id: ids, user: req.user._id })
    res.status(200).send({ done: true, message: "deleted successfully" })
  } catch (Exception) {
    res.send({ done: false, message: Exception.message })
  }
}

//get one todo
module.exports.getOneTodo = async (req, res) => {
  try {
    //get ids from request
    const id = req.params.id
    if (!id) {
      res.status(404).send({ done: false, message: "id not found" })
    }
    //delete many with match of id and user
    let todo = await Todos.findById({ _id: id, user: req.user._id })
    if (todo) {
      res.status(200).send({ done: true, todo })
      return
    } else {
      res.status(404).send({ done: false, message: "Not found" })
    }
  } catch (Exception) {
    res.send({ done: false, message: Exception.message })
  }
}
