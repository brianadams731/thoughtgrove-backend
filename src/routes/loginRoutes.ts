import express from "express";
import { User } from "../models/User";

const loginRouter = express.Router();

loginRouter.route("/login")
    .post(async(req,res) =>{
        const loginCred = req.body;
        loginCred.password = req.body.password   // TODO hash password to match db pass
        const user = await User.findOne({where:{email:loginCred.email, password: loginCred.password}});
        if(!user){
            return res.status(401).send("Error: Invalid Credentials")
        }
        // TODO SESSIONS, WHEN AUTH IS IMPLEMENTED SEND COOKIES HERE
        return res.json(user);
    })

export {loginRouter};