const { Todos, validate } = require("../Models/Todos")

//get all todos of user
module.exports.getAllTodos = async (req, res) => {
  try {
    //get userid from req.user and get all todos of that user
    const range = req.query.range ? JSON.parse(req.query.range) : []
    const sort = req.query.sort ? JSON.parse(req.query.sort) : []
    console.log(req.query)
    const total = await Todos.countDocuments()
    const todos = await Todos.find({ user: req.user._id })
    .sort(sort[0])
      .skip(range[0])
      .limit(range[1] - range[0]+1)
    // console.log(todos)
    res.status(200).send({ done: true, todos, total })
  } catch (Exception) {
    res.status(500).send({ done: false, message: Exception.message })
  }
}

//create a record of todo
module.exports.createTodo = async (req, res) => {
  try {
    //validate data
    const { error } = validate(req.body)
    //return if data is not valid
    if (error) {
      res.send({done:false,message:error})
      return
    }
    //creating an object of todo
    const { title, desc, status, targetDate } = req.body
    const path = req.body.path || ""
    let todo = new Todos({
      title,
      desc,
      status,
      path,
      targetDate,
      createdAt: Date.now(),
      user: req.user._id
    })
    //save in mongodb and return to response
    await todo.save()
    res.status(200).send({ done: true, todo })
  } catch (Exception) {
    res.send({ done: false, message: Exception.message })
  }
}

//update todo
module.exports.updateTodo = async (req, res) => {
  try {
    //checking for id in request body
    const { _id, user } = req.body
    if (!_id && !user) {
      res.status(404).send({ done: false, message: "Id not found" })
    }
    //check ownership of todo
    if (req.body.user != req.user._id) {
      console.log(req.body.user, req.user._id)
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
      path: req.body.path || todo.path || "",
      targetDate: req.body.targetDate || todo.targetDate
    })
    res.send({ done: true, message: "Updated successfully" })
  } catch (Exception) {
    res.send({ done: false, message: Exception.message })
  }
}

//get todos with sorted date
module.exports.dateSortedTodos = async (req, res) => {
  try {
    //get userid from req.user and get all sorted todos of that user
    const todos = await Todos.find({ user: req.user._id }).sort({
      targetDate: "ascending"
    })
    res.status(200).send({ done: true, todos })
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
    }
    //deleting record
    await Todos.findOneAndDelete({ _id:id, user: req.user._id })
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
