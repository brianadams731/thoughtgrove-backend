import express from "express";
import { getConnection, getRepository } from "typeorm";
import { requiresParsedDiscussionId } from "../middleware/requiresParsedDiscussionId";
import { requiresParsedGroupId } from "../middleware/requiresParsedGroupId";
import { requireWithUserAsync } from "../middleware/requireWithUserAsync";
import { Group } from "../models/Group";
import { GroupDiscussion } from "../models/GroupDiscussion";
import { GroupUser } from "../models/GroupUser";

const discussionRoutes = express.Router();

discussionRoutes.post("/discussion/add", requireWithUserAsync, async(req,res)=>{
    if(!req.user || !req.body.groupId || !req.body.title){
        return res.status(500).send("Error: Malformed Request")
    }

    const requestedUser = await getRepository(GroupUser).createQueryBuilder("groupUser")
    .select(["groupUser.role","user.id"])
    .leftJoin("groupUser.user","user")
    .where("groupUser.userId = :userId and groupUser.groupId = :groupId",{userId:req.user.id, groupId: req.body.groupId})
    .getOne();

    if(!requestedUser || requestedUser.role == "banned"){
        return res.status(500).send("Error: User cannot author discussion")
    }

    const group = await Group.findOne(req.body.groupId,{
        select:["id"]
    })

    if(!group){
        return res.status(500).send("Error: Group does not found")
    }
    
    const discussion = new GroupDiscussion();
    discussion.author = requestedUser.user;
    discussion.group = group;
    discussion.title = req.body.title;
    await discussion.save();
    return res.status(200).json(discussion);
})

discussionRoutes.get("/discussion/byGroupId/:groupId", requiresParsedGroupId, async (req,res)=>{
    const discussions = await getRepository(GroupDiscussion).createQueryBuilder("discussion")
    .select(["discussion.id", "discussion.title", "discussion.groupId", "author.id", "author.username"])
    .leftJoin("discussion.author","author")
    .where("discussion.groupId = :groupId", {groupId:req.groupId})
    .getMany();

    return res.json(discussions);
})

discussionRoutes.delete("/discussion/byId/:discussionId", requiresParsedDiscussionId, requireWithUserAsync ,async(req,res)=>{
    const discussion = await getRepository(GroupDiscussion).createQueryBuilder("discussion")
    .select(["discussion.id", "discussion.groupId","author.id"])
    .leftJoin("discussion.author","author")
    .where("discussion.id = :discussionId", {discussionId:req.discussionId})
    .getOne();

    if(!discussion){
        return res.status(500).send("Error: Discussion not found");
    }

    if(discussion.author.id === req.user?.id){
        await discussion.remove();
        return res.status(200).send("Removed Discussion")
    }

    const requestedUser = await getRepository(GroupUser).createQueryBuilder("groupUser")
    .select(["groupUser.role"])
    .leftJoin("groupUser.user","user")
    .where("groupUser.userId = :userId and groupUser.groupId = :groupId",{userId:req.user?.id, groupId: discussion.groupId})
    .getOne();

    if(requestedUser?.role !== "moderator" && requestedUser?.role !== "owner"){
        return res.status(500).send("Error: User not authorized")
    }

    await discussion.remove();
    return res.status(200).send("Success")
})

discussionRoutes.patch("/discussion/byId/:discussionId", requiresParsedDiscussionId, requireWithUserAsync, async(req,res)=>{
    if(!req.body.title){
        return res.status(500).send("Error: Malformed Request")
    }
    const discussion = await getConnection().createQueryBuilder()
    .update(GroupDiscussion) 
    .set({title:req.body.title})
    .where("id = :discussionId and author.id = :authorId",{discussionId: req.discussionId, authorId:req.user?.id})
    .execute();

    if(discussion.affected === 0){
        return res.status(500).send("Error: Discussion not updated")
    }
    
    return res.status(200).send("Entry Updated")
})
export { discussionRoutes }