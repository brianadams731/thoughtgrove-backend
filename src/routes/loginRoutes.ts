import express from "express";
import { User } from "../models/User";
import { checkHashedPasswordAsync } from "../utils/passwordHash";

const loginRouter = express.Router();

loginRouter.route("/login")
    .post(async(req,res) =>{
        const loginCred = req.body;
        const user = await User.findOne({
            select:["email","password"],
            where:{email:loginCred.email}
        });
        if(!user){
            return res.status(401).send("Error: Invalid Credentials")
        
        }
        const isValidPassword = await checkHashedPasswordAsync(loginCred.password, user.password);
        if(!isValidPassword){
            return res.status(401).send("Error: Invalid Credentials")
        }
        // TODO set cookie here!!
        return res.json(user);
    })

export {loginRouter};