import express from "express";
import { getRepository } from "typeorm";
import { requireWithUserAsync } from "../middleware/requireWithUserAsync";
import { withUserAsync } from "../middleware/withUserAsync";
import { Group } from "../models/Group";
import { GroupUser } from "../models/GroupUser";

const groupRoutes = express.Router();

groupRoutes.get("/group/byId/:id", withUserAsync, async(req,res)=>{
    const validGroupId = parseInt(req.params.id)
    const group = await getRepository(Group).createQueryBuilder("groups")
    .select(["groups.id", "groups.name", "groups.description"])
    .where("groups.id = :groupId",{groupId: validGroupId})
    .getOne()

    if(!group){
        return res.status(404).send("Error: Invalid Group")
    }

    let userRole:RetUserRole;
    if(!req.user){
        userRole = "none"
    }else{
        const groupUser = await getRepository(GroupUser).createQueryBuilder("groupUser")
        .select(["groupUser.role"])
        .where("groupUser.userId = :userId and groupUser.groupId = :groupId",{userId: req.user.id, groupId: validGroupId})
        .getOne()

        if(!groupUser){
            userRole = "none"
        }else{
            userRole = groupUser.role
        }
    }

    const retObject: groupById = {
        userRole: userRole,
        group: group
    }

    return res.status(200).json(retObject)
})

groupRoutes.post("/group/add", requireWithUserAsync, async(req,res)=>{
    if(!req.user){
        return res.status(500).send("Error: Not logged in")
    }

    const group = new Group();
    group.name = req.body.name;
    group.description = req.body.description;
    await group.save();

    const groupUser = new GroupUser();
    groupUser.role = "owner";
    groupUser.user = req.user;
    groupUser.group = group;
    await groupUser.save();

    return res.status(200).send("Sucess");
})

groupRoutes.get("/group/users/byId/:groupId", async(req, res)=>{
    const validGroupId = parseInt(req.params.groupId);
    const groupUser = await getRepository(GroupUser).createQueryBuilder("groupUser")
    .select(["user.username","user.id", "groupUser.role"])
    .leftJoin("groupUser.user","user")
    .where("groupUser.groupId := groupId",{groupId: validGroupId})
    .getMany();

    return res.status(200).json(groupUser);
})

groupRoutes.patch("/groups/editPermission/:userId", requireWithUserAsync, async(req,res)=>{

})

type RetUserRole = "owner"|"moderator"|"user"|"none";
interface groupById{
    userRole:RetUserRole,
    group:Group;
}

export { groupRoutes };