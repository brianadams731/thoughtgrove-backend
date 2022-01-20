import { NextFunction, Response } from "express";

const requiresParsedGroupId = (req:any,res:Response,next:NextFunction) =>{
    const groupId = parseInt(req.params.groupId);
    if(isNaN(groupId)){
        return res.status(400).send("Error: Invalid Group Id")
    }
    req.groupId = groupId;
    next();
}

export { requiresParsedGroupId }