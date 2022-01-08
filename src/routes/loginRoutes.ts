import express from "express";
import { User } from "../models/User";
import { checkHashedPasswordAsync } from "../utils/passwordHash";

const loginRouter = express.Router();

loginRouter.route("/login")
    .post(async(req,res) =>{
        const loginCred = req.body;
        const user = await User.findOne({
            select:["email","password","id"],
            where:{email:loginCred.email}
        });
        // Checking for user ahead to save hashing against an invalid user
        if(!user){
            return res.status(401).send("Error: Invalid Credentials")
        }

        const isValidPassword = await checkHashedPasswordAsync(loginCred.password, user.password);
        
        if(!isValidPassword){
            return res.status(401).send("Error: Invalid Credentials")
        }else{
            req.session.userID = user!.id;
            return res.status(200).send("Good");
        }
    })

export {loginRouter};