"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.discussionCommentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const typeorm_1 = require("typeorm");
const requiresParsedDiscussionId_1 = require("../middleware/requiresParsedDiscussionId");
const requireUserGroupRoleAsync_1 = require("../middleware/requireUserGroupRoleAsync");
const requireWithUserAsync_1 = require("../middleware/requireWithUserAsync");
const requreParsedDiscussionCommentId_1 = require("../middleware/requreParsedDiscussionCommentId");
const DiscussionComment_1 = require("../models/DiscussionComment");
const GroupDiscussion_1 = require("../models/GroupDiscussion");
const discussionCommentRoutes = express_1.default.Router();
exports.discussionCommentRoutes = discussionCommentRoutes;
discussionCommentRoutes.get("/discussion/comment/byDiscussionId/:discussionId", requiresParsedDiscussionId_1.requiresParsedDiscussionId, async (req, res) => {
    if (!req.discussionId) {
        return res.status(500).send("Error: Malformed Request");
    }
    const discussionComments = await (0, typeorm_1.getRepository)(DiscussionComment_1.DiscussionComment).createQueryBuilder("comment")
        .select(["comment.id", "comment.content", "author.username", "author.id"])
        .where("comment.discussionId = :discussionId", { discussionId: req.discussionId })
        .leftJoin("comment.author", "author")
        .getMany();
    return res.status(200).json(discussionComments);
});
discussionCommentRoutes.post("/discussion/comment/add/:discussionId", requiresParsedDiscussionId_1.requiresParsedDiscussionId, requireWithUserAsync_1.requireWithUserAsync, requireUserGroupRoleAsync_1.requireUserGroupRoleAsync, async (req, res) => {
    if (req.userGroupRole === "banned" || req.userGroupRole === "none" || !req.userGroupRole || !req.user || !req.discussionId) {
        return res.status(500).send("Error: User not authorized");
    }
    else if (!req.body.content) {
        return res.status(500).send("Error: Malformed Request");
    }
    const discussion = await (0, typeorm_1.getRepository)(GroupDiscussion_1.GroupDiscussion).createQueryBuilder("discussion")
        .where("discussion.id = :discussionId", { discussionId: req.discussionId })
        .getOne();
    if (!discussion) {
        return res.status(500).send("Error: Discussion does not exist");
    }
    const discussionComment = new DiscussionComment_1.DiscussionComment();
    discussionComment.content = req.body.content;
    discussionComment.author = req.user;
    discussionComment.discussion = discussion;
    await discussionComment.save();
    return res.status(200).send("Success");
});
discussionCommentRoutes.delete("/discussion/comment/byId/:discussionCommentId", requreParsedDiscussionCommentId_1.requiresParsedDiscussionCommentId, requireWithUserAsync_1.requireWithUserAsync, requireUserGroupRoleAsync_1.requireUserGroupRoleAsync, async (req, res) => {
    if (!req.user || !req.userGroupRole || !req.discussionCommentId) {
        return res.status(500).send("Error: Malformed Request");
    }
    const discussionComment = await (0, typeorm_1.getRepository)(DiscussionComment_1.DiscussionComment).createQueryBuilder("comment")
        .select(["comment.id", "author.id"])
        .leftJoin("comment.author", "author")
        .where("comment.id = :discussionCommentId", { discussionCommentId: req.discussionCommentId })
        .getOne();
    if (!discussionComment) {
        return res.status(500).send("Error: Comment not found");
    }
    if (req.user.id === discussionComment.author?.id || req.userGroupRole === "moderator" || req.userGroupRole === "owner") {
        await discussionComment.remove();
        return res.status(200).send("Success");
    }
    return res.status(500).send("Error: User not Authorized");
});
discussionCommentRoutes.patch("/discussion/comment/byId/:discussionCommentId", requreParsedDiscussionCommentId_1.requiresParsedDiscussionCommentId, requireWithUserAsync_1.requireWithUserAsync, requireUserGroupRoleAsync_1.requireUserGroupRoleAsync, async (req, res) => {
    if (!req.user || !req.userGroupRole || !req.discussionCommentId || !req.body.content) {
        return res.status(500).send("Error: Malformed Request");
    }
    const updatedCommentComment = await (0, typeorm_1.getConnection)().createQueryBuilder()
        .update(DiscussionComment_1.DiscussionComment)
        .set({ content: req.body.content })
        .where("id = :discussionCommentId and author.id = :userId", { discussionCommentId: req.discussionCommentId, userId: req.user.id })
        .execute();
    if (updatedCommentComment.affected === 0) {
        return res.status(500).send("Error: Could not update comment");
    }
    return res.status(200).send("Success");
});
