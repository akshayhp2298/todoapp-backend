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
  const { title, desc, status } = req.body
  const path = req.body.path || ""
  let todo = new Todos({
    title,
    desc,
    status,
    path,
    createdAt: Date.now(),
    user: req.user._id
  })
  //save in mongodb and return to response
  await todo.save()
  res.status(200).send({ done: true, todo })
}
