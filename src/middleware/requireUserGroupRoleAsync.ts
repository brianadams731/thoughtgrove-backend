import { NextFunction, Response, Request } from "express"
import { getRepository } from "typeorm";
import { GroupUser } from "../models/GroupUser";

// REQUIRES groupId at top level in request
// MUST RUN AFTER REQUIRE USER
const requireUserGroupRoleAsync = async function (req:Request,res: Response,next: NextFunction):Promise<void>{
    if(!req.userGroupId && req.body.groupId){
        req.userGroupId = req.body.groupId
    }
    if(!req.user){
        res.status(500).send("Error: User middleware needs to be above");
        return;
    }
    const requester = await getRepository(GroupUser).createQueryBuilder("groupUser")
    .select(["groupUser.role"])
    .leftJoin("groupUser.user","user")
    .where("groupUser.userId = :userId and groupUser.groupId = :groupId",{userId:req.user.id, groupId: req.userGroupId})
    .getOne();

    if(!requester){
        res.status(500).send("Error: Invalid User");
        return
    }
    
    req.userGroupRole = requester.role;
    req.userGroupId = requester.groupId;
    return next();
}

export { requireUserGroupRoleAsync }