import express from "express";

const registerRouter = express.Router();

registerRouter.post("/",(req,res)=>{
    res.send("regRoute")
})

export {registerRouter};