import express from "express";
import { getConnection, getRepository } from "typeorm";
import { requiresParsedDiscussionId } from "../middleware/requiresParsedDiscussionId";
import { requireUserGroupRoleAsync } from "../middleware/requireUserGroupRoleAsync";
import { requireWithUserAsync } from "../middleware/requireWithUserAsync";
import { requiresParsedDiscussionCommentId } from "../middleware/requreParsedDiscussionCommentId";
import { DiscussionComment } from "../models/DiscussionComment";
import { GroupDiscussion } from "../models/GroupDiscussion";

const discussionCommentRoutes = express.Router();

discussionCommentRoutes.get("/discussion/comment/byDiscussionId/:discussionId", requiresParsedDiscussionId ,async(req,res)=>{
    if(!req.discussionId){
        return res.status(500).send("Error: Malformed Request");
    }
    const discussionComments = await getRepository(DiscussionComment).createQueryBuilder("comment")
    .select(["comment.id", "comment.content", "author.username", "author.id"])
    .where("comment.discussionId = :discussionId", {discussionId: req.discussionId})
    .leftJoin("comment.author", "author")
    .orderBy("comment.createdAt", "ASC")
    .getMany();

    return res.status(200).json(discussionComments);
})

discussionCommentRoutes.post("/discussion/comment/add/:discussionId", 
requiresParsedDiscussionId,
requireWithUserAsync,
//requireUserGroupRoleAsync,
async(req,res)=>{
    /*if(req.userGroupRole === "banned" || req.userGroupRole === "none" || !req.userGroupRole){
        return res.status(500).send("Error: User not authorized");
    }*/

    if(!req.body.content || !req.user || !req.discussionId){
        return res.status(500).send("Error: Malformed Request");
    }

    const discussion = await getRepository(GroupDiscussion).createQueryBuilder("discussion")
    .where("discussion.id = :discussionId",{discussionId: req.discussionId})
    .getOne();

    if(!discussion){
        return res.status(500).send("Error: Discussion does not exist");
    }
    const discussionComment = new DiscussionComment();
    discussionComment.content = req.body.content;
    discussionComment.author = req.user;
    discussionComment.discussion = discussion;
    await discussionComment.save();
    return res.status(200).send("Success");
})

discussionCommentRoutes.delete("/discussion/comment/byId/:discussionCommentId",
requiresParsedDiscussionCommentId,
requireWithUserAsync,
requireUserGroupRoleAsync, async(req, res)=>{
    if(!req.user || !req.userGroupRole || !req.discussionCommentId){
        return res.status(500).send("Error: Malformed Request");
    }

    const discussionComment = await getRepository(DiscussionComment).createQueryBuilder("comment")
    .select(["comment.id", "author.id"])
    .leftJoin("comment.author","author")
    .where("comment.id = :discussionCommentId",{discussionCommentId: req.discussionCommentId})
    .getOne();
    
    if(!discussionComment){
        return res.status(500).send("Error: Comment not found");
    }

    if(req.user.id === discussionComment.author?.id || req.userGroupRole === "moderator" || req.userGroupRole === "owner"){
        await discussionComment.remove();
        return res.status(200).send("Success")
    }
    return res.status(500).send("Error: User not Authorized")
})

discussionCommentRoutes.patch("/discussion/comment/byId/:discussionCommentId",
requiresParsedDiscussionCommentId,
requireWithUserAsync,
requireUserGroupRoleAsync, async(req, res)=>{
    if(!req.user || !req.userGroupRole || !req.discussionCommentId || !req.body.content){
        return res.status(500).send("Error: Malformed Request");
    }

    const updatedCommentComment = await getConnection().createQueryBuilder()
        .update(DiscussionComment)
        .set({content: req.body.content})
        .where("id = :discussionCommentId and author.id = :userId", {discussionCommentId:req.discussionCommentId, userId: req.user.id})
        .execute()
    
    if(updatedCommentComment.affected === 0){
        return res.status(500).send("Error: Could not update comment");
    }

    return res.status(200).send("Success");

})

export { discussionCommentRoutes };