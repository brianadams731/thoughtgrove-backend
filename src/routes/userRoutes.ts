import express from "express";
import { requireWithUserAsync } from "../middleware/requireWithUserAsync";
import { User } from "../models/User";

const userRouter = express.Router();

userRouter.get("/user/byID/:id", async(req,res)=>{
    const userID = parseInt(req.params.id);
    const person = await User.findOne(userID);
    if(!person){
        return res.status(404).send("no such record exists")
    }
    return res.json(person);
})

userRouter.get("/owner", requireWithUserAsync ,async(req,res)=>{
    return res.json({
        id:req.user?.id,
        email: req.user?.email,
        username: req.user?.username,
        role: req.user?.role
    });
})

userRouter.delete("/user/delete", requireWithUserAsync, async(req,res)=>{
    const userToDelete = req.user;
    if(!userToDelete){
        return res.status(500).send("Error: Could not delete user");
    }
    const user = await User.delete(userToDelete.id);
    if(user.affected == 0){
        return res.status(500).send("Error: Could not delete user")
    }
    return res.json(userToDelete);
})

export {userRouter}