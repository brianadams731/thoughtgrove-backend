import express from "express";
import { User } from "../models/User";

const userRouter = express.Router();

userRouter.route("/user/byID/:id")
    .get(async(req,res)=>{
        const person = await User.findOne({where: {id:req.params.id}});
        if(!person){
            return res.send("no such record exists")
        }
        return res.send(person);
    }).delete(async(req,res)=>{
        const varifiedUserID:number = parseInt(req.params.id)  // TODO VERIFY THAT THIS IS THE USER SENDING THIS ID!!!!!
        const personToDelete = await User.findOne(varifiedUserID);
        const user = await User.delete(varifiedUserID);
        if(user.affected == 0){
            return res.status(500).send("Error: Could not delete")
        }
        return res.json(personToDelete);
    })


export {userRouter}