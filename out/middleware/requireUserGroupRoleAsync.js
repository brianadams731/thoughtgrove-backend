"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireUserGroupRoleAsync = void 0;
const typeorm_1 = require("typeorm");
const GroupUser_1 = require("../models/GroupUser");
// REQUIRES groupId at top level in request
// MUST RUN AFTER REQUIRE USER
const requireUserGroupRoleAsync = async function (req, res, next) {
    if (!req.groupId && req.body.groupId) {
        req.groupId = req.body.groupId;
    }
    if (!req.user) {
        res.status(500).send("Error: User middleware needs to be above");
        return;
    }
    const requester = await (0, typeorm_1.getRepository)(GroupUser_1.GroupUser).createQueryBuilder("groupUser")
        .select(["groupUser.role"])
        .leftJoin("groupUser.user", "user")
        .where("groupUser.userId = :userId and groupUser.groupId = :groupId", { userId: req.user.id, groupId: req.groupId })
        .getOne();
    if (!requester) {
        res.status(500).send("Error: Invalid User");
        return;
    }
    req.userGroupRole = requester.role;
    req.userGroupId = requester.groupId;
    next();
};
exports.requireUserGroupRoleAsync = requireUserGroupRoleAsync;
