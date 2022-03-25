import fs from "fs";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { body, validationResult } from "express-validator";
import { v4 as uuidv4 } from "uuid";

const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const validator = [
  body("title").isString().isLength({min: 3}),
  body("description").isString().isLength({min: 5}),
  body("time").isString(),
];

const errorHandle = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ message: errors.array()[0] });
  }
};

app.get("/todos", (req, res) => {
  const todos = fs.readFileSync("todos.json", "utf-8");
  res.status(200);
  res.send(todos);
});

app.get("/donetodos", (req, res) => {
  const todos = fs.readFileSync("donetodos.json", "utf-8");
  res.status(200);
  res.send(todos);
});

app.post("/addtodo", ...validator, (req, res) => {
  if (errorHandle(req, res)) {
    return;
  }
  let todos = fs.readFileSync("todos.json", "utf-8");
  todos = JSON.parse(todos);
  todos.push({
    id: uuidv4(),
    title: req.body.title,
    description: req.body.description,
    time: req.body.time,
  });
  fs.writeFileSync("todos.json", JSON.stringify(todos));
  res.status(200);
  res.send("Successfully Added!");
});

app.put("/edit", ...validator, (req, res) => {
  if (errorHandle(req, res)) {
    return;
  }
  if (!req.body.id) {
    return res.status(400).send({"message": { "msg":"Please Provide ID!"}});
  }
  let todos = fs.readFileSync("todos.json", "utf-8");
  todos = JSON.parse(todos);
  let filteredTodos = todos.filter((todo) => todo.id !== req.body.id);
  if (todos.length === filteredTodos.length) {
    return res.status(404).send({"message": { "msg":"Data Not found!"}});
  }
  filteredTodos.push(req.body);
  fs.writeFileSync("todos.json", JSON.stringify(filteredTodos));
  res.status(200).send("Successfully Edited!");
});

app.post("/addtodone", ...validator, (req, res) => {
  if (errorHandle(req, res)) {
    return;
  }
  if (!req.body.id) {
    return res.status(400).send({"message": { "msg":"Please Provide ID!"}});
  }
  let todos = fs.readFileSync("todos.json", "utf-8");
  todos = JSON.parse(todos);
  let doneTodos = fs.readFileSync("doneTodos.json", "utf-8");
  doneTodos = JSON.parse(doneTodos);
  let filteredTodos = todos.filter((todo) => todo.id !== req.body.id);
  if (todos.length === filteredTodos.length) {
    return res.status(404).send({"message": { "msg":"Data Not found!"}});
  }
  fs.writeFileSync("todos.json", JSON.stringify(filteredTodos));
  doneTodos.push(req.body);
  fs.writeFileSync("doneTodos.json", JSON.stringify(doneTodos));
  res.status(200);
  res.send("Successfully Added!");
});

app.post("/addtotodo", ...validator, (req, res) => {
  if (errorHandle(req, res)) {
    return;
  }
  if (!req.body.id) {
    return res.status(400).send({"message": { "msg":"Please Provide ID!"}});
  }
  let todos = fs.readFileSync("todos.json", "utf-8");
  todos = JSON.parse(todos);
  let doneTodos = fs.readFileSync("doneTodos.json", "utf-8");
  doneTodos = JSON.parse(doneTodos);
  let filteredTodos = doneTodos.filter((todo) => todo.id !== req.body.id);
  if (doneTodos.length === filteredTodos.length) {
    return res.status(404).send({"message": { "msg":"Data Not found!"}});
  }
  fs.writeFileSync("doneTodos.json", JSON.stringify(filteredTodos));
  todos.push(req.body);
  fs.writeFileSync("todos.json", JSON.stringify(todos));
  res.status(200);
  res.send("Successfully Added!");
});

app.post("/tododelete", (req, res) => {
  if (!req.body.id) {
    return res.status(400).send({"message": { "msg":"Please Provide ID!"}});
  }
  let doneTodos = fs.readFileSync("doneTodos.json", "utf-8");
  if (doneTodos.length > 10) {
    doneTodos = JSON.parse(doneTodos);
    let filteredTodos = doneTodos.filter((todo) => todo.id !== req.body.id);
    if (filteredTodos.length === doneTodos.length) {
      return res.status(404).send({"message": { "msg":"Data Not found!"}});
    }
    fs.writeFileSync("doneTodos.json", JSON.stringify(filteredTodos));
    res.status(200).send("Successfully Deleted!");
  } else {
    res.status(400).send("Bad Request!");
  }
});

app.listen(4000, () => {
  console.log("Server up on port 4000");
});
