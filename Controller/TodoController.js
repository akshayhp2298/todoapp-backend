const { Todos, validate } = require("../Models/Todos")

//get all todos of user
module.exports.getAllTodos = async (req, res) => {
  //get userid from req.user and get all todos of that user
  const todos = await Todos.find({ user: req.user._id })
  res.status(200).send({ done: true, todos })
}

//create a record of todo
module.exports.createTodo = async (req, res) => {
  //validate data
  const { error } = validate(req.body)
  //return if data is not valid
  if (error) {
    res.send(error)
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
}

//update todo
module.exports.updateTodo = async (req, res) => {
  //checking for id in request body
  const { _id, user } = req.body
  if (!_id && !user) {
    res.status(404).send({ done: false, message: "Id not found" })
  }
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
}

//get todos with sorted date
module.exports.dateSortedTodos = async (req, res) => {
  //get userid from req.user and get all sorted todos of that user
  const todos = await Todos.find({ user: req.user._id }).sort({
    targetDate: "ascending"
  })
  res.status(200).send({ done: true, todos })
}
