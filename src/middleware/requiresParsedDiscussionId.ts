import { NextFunction, Response } from "express";

const requiresParsedDiscussionId = (req:any,res:Response,next:NextFunction) =>{
    const discussionId = parseInt(req.params.discussionId);
    if(isNaN(discussionId)){
        return res.status(400).send("Error: Invalid discussion Id")
    }
    req.discussionId = discussionId;
    next();
}

export { requiresParsedDiscussionId }