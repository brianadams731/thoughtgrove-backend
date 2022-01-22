import { NextFunction, Response } from "express";

const requiresParsedDiscussionCommentId = (req:any,res:Response,next:NextFunction) =>{
    const discussionCommentId = parseInt(req.params.discussionCommentId);
    if(isNaN(discussionCommentId)){
        return res.status(400).send("Error: Invalid discussion Id")
    }
    req.discussionCommentId = discussionCommentId;
    return next();
}

export { requiresParsedDiscussionCommentId }