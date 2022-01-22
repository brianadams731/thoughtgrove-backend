import express from "express";
import { getConnection, getRepository } from "typeorm";
import { requiresParsedGroupId } from "../middleware/requiresParsedGroupId";
import { requireUserGroupRoleAsync } from "../middleware/requireUserGroupRoleAsync";
import { requireWithUserAsync } from "../middleware/requireWithUserAsync";
import { requiresParsedBulletinId } from "../middleware/requreParsedBulletinId";
import { Group } from "../models/Group";
import { GroupBulletin } from "../models/GroupBulletin";

const bulletinRoutes = express.Router();

bulletinRoutes.get("/bulletin/byGroupId/:groupId", requiresParsedGroupId, async (req,res)=>{
    const bulletins = await getRepository(GroupBulletin).createQueryBuilder("bulletin")
    .select(["bulletin.id","bulletin.message"])
    .where("bulletin.group.id = :groupId",{groupId:req.groupId})
    .getMany();

    return res.json(bulletins);
})

bulletinRoutes.post("/bulletin/add", requireWithUserAsync, requireUserGroupRoleAsync, async(req,res)=>{
    if( !req.userGroupRole || !req.body.message){
        return res.status(500).send("Error: Malformed Request")
    }else if(req.userGroupRole !== "owner" && req.userGroupRole !== "moderator"){
        return res.status(500).send("Error: Unauthorized User")
    }

    const group = await Group.findOne(req.body.groupId,{
        select:["id"]
    })
    if(!group){
        return res.status(500).send("Error Group not found");
    }

    const bulletin = new GroupBulletin();
    bulletin.message = req.body.message;
    bulletin.group = group;
    await bulletin.save();

    return res.status(200).send("Success");
})

bulletinRoutes.patch("/bulletin/byId/:bulletinId", 
requiresParsedBulletinId, 
requireWithUserAsync, 
requireUserGroupRoleAsync,
async(req, res)=>{

    if(!req.userGroupRole || !req.body.message || !req.bulletinId){
        return res.status(500).send("Error: Malformed Request")
    }else if(req.userGroupRole !== "owner" && req.userGroupRole !== "moderator"){
        return res.status(500).send("Error: Unauthorized User")
    }

    const bulletin = await getConnection().createQueryBuilder()
    .update(GroupBulletin) 
    .set({message:req.body.message})
    .where("id = :bulletinId",{bulletinId: req.bulletinId})
    .execute();

    if(bulletin.affected == 0){
        return res.status(500).send("Error: Not updated")
    }

    res.status(200).send("Success");
})

bulletinRoutes.delete("/bulletin/byId/:bulletinId",
requiresParsedBulletinId, 
requireWithUserAsync, 
requireUserGroupRoleAsync,
async(req,res)=>{
    if(!req.userGroupRole || !req.bulletinId){
        return res.status(500).send("Error: Malformed Request")
    }else if(req.userGroupRole !== "owner" && req.userGroupRole !== "moderator"){
        return res.status(500).send("Error: Unauthorized User")
    }

    const bulletinToRemove = await GroupBulletin.findOne(req.bulletinId);
    if(!bulletinToRemove){
        return res.status(500).send("Error: Bulletin not found");
    }

    await bulletinToRemove.remove();
    return res.status(200).send("Success")
})

export { bulletinRoutes };