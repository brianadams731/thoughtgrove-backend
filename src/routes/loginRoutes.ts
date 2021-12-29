import express from "express";

const loginRouter = express.Router();

loginRouter.route("/login")
    .get((req,res)=>{
        res.send("login get")
    })
    .post((req,res) =>{
        res.send("login post")
    })

export {loginRouter};