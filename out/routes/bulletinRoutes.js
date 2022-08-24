"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulletinRoutes = void 0;
const express_1 = __importDefault(require("express"));
const typeorm_1 = require("typeorm");
const requiresParsedGroupId_1 = require("../middleware/requiresParsedGroupId");
const requireUserGroupRoleAsync_1 = require("../middleware/requireUserGroupRoleAsync");
const requireWithUserAsync_1 = require("../middleware/requireWithUserAsync");
const requreParsedBulletinId_1 = require("../middleware/requreParsedBulletinId");
const Group_1 = require("../models/Group");
const GroupBulletin_1 = require("../models/GroupBulletin");
const bulletinRoutes = express_1.default.Router();
exports.bulletinRoutes = bulletinRoutes;
bulletinRoutes.get("/bulletin/byGroupId/:groupId", requiresParsedGroupId_1.requiresParsedGroupId, async (req, res) => {
    const bulletins = await (0, typeorm_1.getRepository)(GroupBulletin_1.GroupBulletin).createQueryBuilder("bulletin")
        .select(["bulletin.id", "bulletin.message"])
        .where("bulletin.group.id = :groupId", { groupId: req.groupId })
        .getMany();
    return res.json(bulletins);
});
bulletinRoutes.post("/bulletin/add/:groupId", requiresParsedGroupId_1.requiresParsedGroupId, requireWithUserAsync_1.requireWithUserAsync, requireUserGroupRoleAsync_1.requireUserGroupRoleAsync, async (req, res) => {
    if (!req.userGroupRole || !req.body.message) {
        return res.status(500).send("Error: Malformed Request");
    }
    else if (req.userGroupRole !== "owner" && req.userGroupRole !== "moderator") {
        return res.status(500).send("Error: Unauthorized User");
    }
    const group = await Group_1.Group.findOne(req.groupId, {
        select: ["id"]
    });
    if (!group) {
        return res.status(500).send("Error Group not found");
    }
    const bulletin = new GroupBulletin_1.GroupBulletin();
    bulletin.message = req.body.message;
    bulletin.group = group;
    await bulletin.save();
    return res.status(200).send("Success");
});
bulletinRoutes.patch("/bulletin/byId/:bulletinId", requreParsedBulletinId_1.requiresParsedBulletinId, requireWithUserAsync_1.requireWithUserAsync, requireUserGroupRoleAsync_1.requireUserGroupRoleAsync, async (req, res) => {
    if (!req.userGroupRole || !req.body.message || !req.bulletinId) {
        return res.status(500).send("Error: Malformed Request");
    }
    else if (req.userGroupRole !== "owner" && req.userGroupRole !== "moderator") {
        return res.status(500).send("Error: Unauthorized User");
    }
    const bulletin = await (0, typeorm_1.getConnection)().createQueryBuilder()
        .update(GroupBulletin_1.GroupBulletin)
        .set({ message: req.body.message })
        .where("id = :bulletinId", { bulletinId: req.bulletinId })
        .execute();
    if (bulletin.affected == 0) {
        return res.status(500).send("Error: Not updated");
    }
    res.status(200).send("Success");
});
bulletinRoutes.delete("/bulletin/byId/:bulletinId", requreParsedBulletinId_1.requiresParsedBulletinId, requireWithUserAsync_1.requireWithUserAsync, requireUserGroupRoleAsync_1.requireUserGroupRoleAsync, async (req, res) => {
    if (!req.userGroupRole || !req.bulletinId) {
        return res.status(500).send("Error: Malformed Request");
    }
    else if (req.userGroupRole !== "owner" && req.userGroupRole !== "moderator") {
        return res.status(500).send("Error: Unauthorized User");
    }
    const bulletinToRemove = await GroupBulletin_1.GroupBulletin.findOne(req.bulletinId);
    if (!bulletinToRemove) {
        return res.status(500).send("Error: Bulletin not found");
    }
    await bulletinToRemove.remove();
    return res.status(200).send("Success");
});
