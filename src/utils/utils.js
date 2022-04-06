import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import { Users } from "../models/users.js";

export const authUser = async (email, password) => {
  const user = await Users.findOne({ email });
  if (!user) {
    throw new Error("Unable to login!");
  }
  const match = await bcryptjs.compare(password, user.password);
  if (!match) {
    throw new Error("Unable to login!");
  }
  return user;
};

export const getAuthToken = async (user) => {
  const token = jsonwebtoken.sign({ _id: user._id }, process.env.JWT_SECRET, {expiresIn: "2 hours"});
  return token;
};

export const authToken = async (req, res, next) => {
  try {
    const token = req.header("authToken").replace("ToAp ", "");
    const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
    const user = await Users.findOne({ _id: decoded._id });

    if (!user) {
        throw new Error("Authentication Failed.")
    }
    req.user = user;
    next();
  } catch (e) {
      res.status(401).send("Authentication Failed.")
  }
};
