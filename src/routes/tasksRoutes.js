import express from "express";
import { Task } from "../models/tasks.js";
import { authToken } from "../utils/utils.js";

export const taskRouter = express.Router();

taskRouter.get("/todos", authToken, async (req, res) => {
  try {
    const tasks = await Task.find({ done: false, userId: req.user._id});
    res.send(tasks || []);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

taskRouter.get("/donetodos", authToken, async (req, res) => {
  try {
    const tasks = await Task.find({ done: true, userId: req.user._id});
    res.send(tasks || []);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

taskRouter.post("/addtodo", authToken, async (req, res) => {
  const user = new Task({
      ...req.body,
      userId: req.user._id
  });
  try {
    await user.save();
    res.send("Successfully Added!");
  } catch (e) {
    res.status(400).send(e.message);
  }
});

taskRouter.put("/edit", authToken, async (req, res) => {
  const data = Object.keys(req.body);
  data.pop("__v");
  const allowed = ["title", "description", "time", "_id", "done"];
  let check = data.every((one) => allowed.includes(one));
  if (!check) {
    return res.status(404).send("Invalid Column names!");
  }

  try {
    const task = await Task.findOne({_id: req.body._id, userId: req.user._id});

    if (!task) {
      return res.status(404).send("Couldn't find the data!");
    }
    await Task.updateOne({_id: task._id}, req.body);
    res.send("Successfully Edited!");
  } catch (e) {
    res.status(400).send(e.message);
  }
});

taskRouter.post("/addtodone", authToken, async (req, res) => {
  try {
    const task = await Task.findOne({_id: req.body._id, userId: req.user._id})
    if (!task) {
      return res.status(404).send("Couldn't find the data!");
    }
    await Task.updateOne({_id: task._id}, {done: true});
    res.send("Success!");
  } catch (e) {
    res.status(400).send(e.message);
  }
});

taskRouter.post("/addtotodo", authToken, async (req, res) => {
  try {
    const task = await Task.findOne({_id: req.body._id, userId: req.user._id})
    if (!task) {
      return res.status(404).send("Couldn't find the data!");
    }
    await Task.updateOne({_id: task._id}, {done: false});
    res.send("Success!");
  } catch (e) {
    res.status(400).send(e.message);
  }
});

taskRouter.post("/tododelete", authToken, async (req, res) => {
  try {
    if (req.body.done === false) {
      res.status(400).send("Can not be deleted!");
    }
    const task = await Task.findOne({_id: req.body._id, userId: req.user._id})
    if (!task) {
      return res.status(404).send("Couldn't find the data!");
    }
    await Task.deleteOne({_id: task._id});
    res.send("Success!");
  } catch (e) {
    res.status(400).send(e.message);
  }
});
