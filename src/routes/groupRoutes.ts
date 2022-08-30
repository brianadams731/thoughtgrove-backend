import express from "express";
import { getRepository } from "typeorm";
import { requireWithUserAsync } from "../middleware/requireWithUserAsync";
import { withUserAsync } from "../middleware/withUserAsync";
import { Group } from "../models/Group";
import { GroupUser } from "../models/GroupUser";

const groupRoutes = express.Router();

groupRoutes.get("/group/byId/:groupId", withUserAsync, async(req,res)=>{
    const validGroupId = parseInt(req.params.groupId)
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
        }else if(groupUser.role === "banned"){
            return res.status(500).send("Error: User is banned");
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

    return res.status(200).send("Success");
})

groupRoutes.get("/group/users/byId/:groupId", async(req, res)=>{
    const validGroupId = parseInt(req.params.groupId);
    const groupUser = await getRepository(GroupUser).createQueryBuilder("groupUser")
    .select(["user.username","user.id", "groupUser.role"])
    .leftJoin("groupUser.user","user")
    .where("groupUser.groupId = :groupId",{groupId: validGroupId})
    .getMany();

    return res.status(200).json(groupUser);
})

groupRoutes.patch("/group/changePermission/:groupId", requireWithUserAsync, async(req,res)=>{
    if(!req.user){
        return res.status(500).send("not logged in")
    }

    const validGroupId = parseInt(req.params.groupId);
    const requester = await getRepository(GroupUser).createQueryBuilder("groupUser")
    .select(["groupUser.role"])
    .where("groupUser.userId = :userId and groupUser.groupId = :groupId",{userId:req.user.id, groupId: validGroupId})
    .getOne();

    if(requester?.role !== "owner" && requester?.role !== "moderator"){
        return res.status(500).send("Error: User not authorized");
    }else if(!req.body.userId || !req.body.modifyRoleTo){
        return res.status(500).send("Error: Malformed Request, invalid fields")
    }else if(req.body.modifyRoleTo !== "owner" && req.body.modifyRoleTo !== "moderator" && req.body.modifyRoleTo !== "user" && req.body.modifyRoleTo !== "banned"){
        return res.status(400).send("Error: Malformed Request, invalid role")
    }

    const userToEditPermission = await GroupUser.findOne({
        where:{
            groupId:validGroupId,
            userId: req.body.userId
        }
    })

    if(!userToEditPermission){
        return res.status(500).send("Error: No User Exists")
    }else if(requester.role !== "owner" && req.body.modifyRoleTo === "owner"){
        return res.status(500).send("Error: Moderators cannot promote users to owners")
    }else if(userToEditPermission.role === "owner" && requester.role !== "owner"){
        return res.status(500).send("Error: Non owners cannot modify role of owner")
    }

    userToEditPermission.role = req.body.modifyRoleTo;
    await userToEditPermission.save();
    return res.status(200).send("Success: User permission changed");
})

groupRoutes.post("/group/users/add/:groupId", requireWithUserAsync, async(req, res)=>{
    const validGroupId = parseInt(req.params.groupId);
    
    // Get reference to group, and verify it exists. If add private to group, add logic here
    const group = await getRepository(Group).createQueryBuilder("groups")
    .where("groups.id = :groupId",{groupId: validGroupId})
    .getOne()
    if(!group || !req.user){
        return res.status(500).send("Error: Not Authorized");
    }

    // Check if user is in group
    const isUserInGroup = await getRepository(GroupUser).createQueryBuilder("groupUser")
    .where("groupUser.groupId = :groupId and groupUser.userId = :userId",{groupId: validGroupId, userId: req.user.id})
    .getCount()
    if(isUserInGroup){ // This will be hit if the user exits or is banned
        return res.status(500).send("Error: User already in group");
    }

    const newUser = new GroupUser();
    newUser.role = "user";
    newUser.user = req.user;
    newUser.group = group;
    await newUser.save();

    return res.status(200).send("Added");
})

groupRoutes.delete("/group/user/:groupId", requireWithUserAsync, async(req,res)=>{
    const validGroupId = parseInt(req.params.groupId);
    if(!req.user){
        return res.status(500).send("Error: No user logged in")
    }
    if(!req.body.userId){
        return res.status(400).send("Error: Malformed Request")
    }
    const requester = await getRepository(GroupUser).createQueryBuilder("groupUser")
    .select(["groupUser.role"])
    .where("groupUser.userId = :userId and groupUser.groupId = :groupId",{userId:req.user.id, groupId: validGroupId})
    .getOne();

    if(!requester){
        return res.status(500).send("Error: Requestor not found in group")
    }
    if(req.user.id === req.body.userId){
        await requester.remove();
        return res.status(200).send("Self Removed")
    }
    if(requester.role === "owner" || requester.role ==="moderator"){
        const personToRemove = await getRepository(GroupUser).createQueryBuilder("groupUser")
        .select(["groupUser.role"])
        .where("groupUser.userId = :userId and groupUser.groupId = :groupId",{userId:req.body.userId, groupId: validGroupId})
        .getOne();
        if(!personToRemove){
            return res.status(400).send("Error: User to remove not found")
        }
        await personToRemove.remove();
        return res.status(200).send("User removed");
    }
    return res.status(403).send("Error: Unauthorized")
})

groupRoutes.get("/group/search/:searchKey", async (req,res)=>{    
    if(!req.params.searchKey){
        return res.status(400).send();
    }

    const searchKey = req.params.searchKey;
    // todo add pagination!
    const groupList = await getRepository(Group).createQueryBuilder("group")
    .select(["group.id","group.name","group.description"])
    .loadRelationCountAndMap('group.userCount', 'group.users')
    .where("LOWER(group.name) like LOWER(:searchKey)",{searchKey:`%${searchKey}%`})
    .getMany();
    
    return res.json(groupList);
})


type RetUserRole = "owner"|"moderator"|"user"|"none"|"banned";
interface groupById{
    userRole:RetUserRole,
    group:Group;
}

export { groupRoutes };