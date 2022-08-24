"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requiresParsedDiscussionCommentId = void 0;
const requiresParsedDiscussionCommentId = (req, res, next) => {
    const discussionCommentId = parseInt(req.params.discussionCommentId);
    if (isNaN(discussionCommentId)) {
        return res.status(400).send("Error: Invalid discussion Id");
    }
    req.discussionCommentId = discussionCommentId;
    return next();
};
exports.requiresParsedDiscussionCommentId = requiresParsedDiscussionCommentId;
