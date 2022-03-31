import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import "./db/mongoose.js";
import { taskRouter } from "./routes/tasksRoutes.js";
import { userRouter } from "./routes/userRoutes.js";

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(taskRouter);

app.use(userRouter);

app.listen(process.env.PORT || 4000, () => {
  console.log("Server up on port 4000");
});
