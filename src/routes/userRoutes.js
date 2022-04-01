import bcryptjs from "bcryptjs";
import express from "express";
import { Users } from "../models/users.js";
import {authUser, getAuthToken} from '../utils/utils.js';

export const userRouter = express.Router();

userRouter.post('/signup', async (req, res) => {
    const user = new Users(req.body);
    try{
        await user.save();
        res.send("User Successfully Created!")
    }catch(e){
        res.status(400).send(e.message)
    }
});

userRouter.post('/login', async (req, res) => {
    if(!req.body?.email || !req.body?.password){
        return res.status(404).send("Please provide email and password.")
    }
    try{
        const user = await authUser(req.body.email, req.body.password);
        const authToken = await getAuthToken(user);
        res.send({user, authToken});
    }catch(e){
        res.status(400).send(e.message);
    }
})