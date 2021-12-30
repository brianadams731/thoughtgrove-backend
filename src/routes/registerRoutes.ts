import express from "express";
import { User } from "../models/User";

const registerRouter = express.Router();

registerRouter.post("/register", async (req,res)=>{
    const parsedUser = req.body;

    const user = await User.create({
        email:parsedUser.email,
        password: parsedUser.password,
        username: parsedUser.username
    }).save();
    
    res.json(user);
})

registerRouter.get("/register/add-test-user", async (req,res)=>{
    await User.create({
        email : "test@test.com",
        password: "testpass",
        username: "John Doe"
    }).save();
    
    return res.send("Test user added");
})

export {registerRouter};