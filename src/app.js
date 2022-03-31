import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import "./db/mongoose.js";
import { Task } from "./models/tasks.js";

const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/todos", async (req, res) => {
  try {
    const tasks = await Task.find({ done: false });
    res.send(tasks || []);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

app.get("/donetodos", async (req, res) => {
  try {
    const tasks = await Task.find({ done: true });
    res.send(tasks || []);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

app.post("/addtodo", async (req, res) => {
  const user = new Task(req.body);
  try {
    await user.save();
    res.send("Successfully Added!");
  } catch (e) {
    res.status(400).send(e.message);
  }
});

app.put("/edit", async (req, res) => {
  const data = Object.keys(req.body);
  data.pop('__v');
  const allowed = ['title', 'description', 'time', '_id', 'done'];
  let check = data.every((one) => allowed.includes(one));
  if (!check) {
    console.log(data);
    return res.status(404).send("Invalid Column names!")
  }

  try {
    const task = await Task.findByIdAndUpdate(req.body._id, req.body, {
      runValidators: true,
    });
    if (!task) {
      return res.status(404).send("Couldn't find the data!");
    }
    res.send("Successfully Edited!");
  } catch (e) {
    res.status(400).send(e.message);
  }
});

app.post("/addtodone", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.body._id, { done: true });
    if (!task) {
      return res.status(404).send("Couldn't find the data!");
    }
    res.send("Success!");
  } catch (e) {
    res.status(400).send(e.message);
  }
});

app.post("/addtotodo", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.body._id, { done: false });
    if (!task) {
      return res.status(404).send("Couldn't find the data!");
    }
    res.send("Success!");
  } catch (e) {
    res.status(400).send(e.message);
  }
});

app.post("/tododelete", async (req, res) => {
  try {
    if (req.body.done === false) {
      res.status(400).send("Can not be deleted!")
    }
    const task = await Task.findByIdAndDelete(req.body._id);
    if (!task) {
      return res.status(404).send("Couldn't find the data!");
    }
    res.send("Success!");
  } catch (e) {
    res.status(400).send(e.message);
  }
});

app.listen(process.env.PORT || 4000, () => {
  console.log("Server up on port 4000");
});
