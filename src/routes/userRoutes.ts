import express from "express";

const userRouter = express.Router();

userRouter.get("/user/byID/:id",(req,res)=>{
    res.send(`user id: ${req.params.id}`)
})

export {userRouter}