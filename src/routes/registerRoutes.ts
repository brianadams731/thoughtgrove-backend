import express from "express";
import { User } from "../models/User";
import { parseUserRegisterAsync } from "../utils/parseUser";
import { UserRoles } from "../utils/userRoles";

const registerRouter = express.Router();

registerRouter.post("/register", async (req,res)=>{
    const parsedUser = await parseUserRegisterAsync(req.body);
    
    let user = await User.create({
        email: parsedUser.email,
        password: parsedUser.password,
        username: parsedUser.username,
        role: UserRoles.user
    }).save().catch(()=>{
        res.status(500).send("Error: User exists")
    });
    
    req.session.userID = user!.id;
    res.redirect("/");
})

export {registerRouter};