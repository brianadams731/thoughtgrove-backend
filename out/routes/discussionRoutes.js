"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.discussionRoutes = void 0;
const express_1 = __importDefault(require("express"));
const typeorm_1 = require("typeorm");
const requiresParsedDiscussionId_1 = require("../middleware/requiresParsedDiscussionId");
const requiresParsedGroupId_1 = require("../middleware/requiresParsedGroupId");
const requireWithUserAsync_1 = require("../middleware/requireWithUserAsync");
const Group_1 = require("../models/Group");
const GroupDiscussion_1 = require("../models/GroupDiscussion");
const GroupUser_1 = require("../models/GroupUser");
const discussionRoutes = express_1.default.Router();
exports.discussionRoutes = discussionRoutes;
discussionRoutes.post("/discussion/add/:groupId", requireWithUserAsync_1.requireWithUserAsync, requiresParsedGroupId_1.requiresParsedGroupId, async (req, res) => {
    if (!req.user || !req.groupId || !req.body.title || !req.body.content) {
        return res.status(500).send("Error: Malformed Request");
    }
    const requestedUser = await (0, typeorm_1.getRepository)(GroupUser_1.GroupUser).createQueryBuilder("groupUser")
        .select(["groupUser.role", "user.id"])
        .leftJoin("groupUser.user", "user")
        .where("groupUser.userId = :userId and groupUser.groupId = :groupId", { userId: req.user.id, groupId: req.groupId })
        .getOne();
    if (!requestedUser || requestedUser.role == "banned") {
        return res.status(500).send("Error: User cannot author discussion");
    }
    const group = await Group_1.Group.findOne(req.groupId, {
        select: ["id"]
    });
    if (!group) {
        return res.status(500).send("Error: Group does not found");
    }
    const discussion = new GroupDiscussion_1.GroupDiscussion();
    discussion.author = requestedUser.user;
    discussion.group = group;
    discussion.title = req.body.title;
    discussion.content = req.body.content;
    await discussion.save();
    return res.status(200).json(discussion);
});
discussionRoutes.get("/discussion/byGroupId/:groupId", requiresParsedGroupId_1.requiresParsedGroupId, async (req, res) => {
    const discussions = await (0, typeorm_1.getRepository)(GroupDiscussion_1.GroupDiscussion).createQueryBuilder("discussion")
        .select(["discussion.id", "discussion.title", "author.id", "author.username"])
        .loadRelationCountAndMap("discussion.commentCount", "discussion.comments", "comments")
        .leftJoin("discussion.author", "author")
        .where("discussion.groupId = :groupId", { groupId: req.groupId })
        .getMany();
    return res.json(discussions);
});
discussionRoutes.get("/discussion/byId/:discussionId", requiresParsedDiscussionId_1.requiresParsedDiscussionId, async (req, res) => {
    const discussions = await (0, typeorm_1.getRepository)(GroupDiscussion_1.GroupDiscussion).createQueryBuilder("discussion")
        .select(["discussion.id", "discussion.title", "discussion.content", "discussion.groupId", "author.id", "author.username"])
        .leftJoin("discussion.author", "author")
        .where("discussion.id = :discussionId", { discussionId: req.discussionId })
        .getOne();
    if (!discussions) {
        return res.status(500).send("Error: Discussion not found");
    }
    return res.json(discussions);
});
discussionRoutes.delete("/discussion/byId/:discussionId", requiresParsedDiscussionId_1.requiresParsedDiscussionId, requireWithUserAsync_1.requireWithUserAsync, async (req, res) => {
    const discussion = await (0, typeorm_1.getRepository)(GroupDiscussion_1.GroupDiscussion).createQueryBuilder("discussion")
        .select(["discussion.id", "discussion.groupId", "author.id"])
        .leftJoin("discussion.author", "author")
        .where("discussion.id = :discussionId", { discussionId: req.discussionId })
        .getOne();
    if (!discussion) {
        return res.status(500).send("Error: Discussion not found");
    }
    if (discussion.author.id === req.user?.id) {
        await discussion.remove();
        return res.status(200).send("Removed Discussion");
    }
    const requestedUser = await (0, typeorm_1.getRepository)(GroupUser_1.GroupUser).createQueryBuilder("groupUser")
        .select(["groupUser.role"])
        .leftJoin("groupUser.user", "user")
        .where("groupUser.userId = :userId and groupUser.groupId = :groupId", { userId: req.user?.id, groupId: discussion.groupId })
        .getOne();
    if (requestedUser?.role !== "moderator" && requestedUser?.role !== "owner") {
        return res.status(500).send("Error: User not authorized");
    }
    await discussion.remove();
    return res.status(200).send("Success");
});
discussionRoutes.patch("/discussion/byId/:discussionId", requiresParsedDiscussionId_1.requiresParsedDiscussionId, requireWithUserAsync_1.requireWithUserAsync, async (req, res) => {
    if (!req.body.title || !req.body.content) {
        return res.status(500).send("Error: Malformed Request");
    }
    const discussion = await (0, typeorm_1.getConnection)().createQueryBuilder()
        .update(GroupDiscussion_1.GroupDiscussion)
        .set({
        title: req.body.title,
        content: req.body.content
    })
        .where("id = :discussionId and author.id = :authorId", { discussionId: req.discussionId, authorId: req.user?.id })
        .execute();
    if (discussion.affected === 0) {
        return res.status(500).send("Error: Discussion not updated");
    }
    return res.status(200).send("Entry Updated");
});
