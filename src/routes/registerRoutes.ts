import express from "express";
import { User } from "../models/User";
import { parseUserRegisterAsync } from "../utils/parseUser";
import { UserRoles } from "../utils/userRoles";

const registerRouter = express.Router();

registerRouter.post("/register", async (req,res)=>{
    const parsedUser = await parseUserRegisterAsync(req.body);
    const user = await User.create({
        email: parsedUser.email,
        password: parsedUser.password,
        username: parsedUser.username,
        role: UserRoles.user
    }).save();
    
    res.json(user);
})

export {registerRouter};