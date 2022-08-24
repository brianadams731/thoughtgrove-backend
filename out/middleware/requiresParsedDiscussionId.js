"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requiresParsedDiscussionId = void 0;
const requiresParsedDiscussionId = (req, res, next) => {
    const discussionId = parseInt(req.params.discussionId);
    if (isNaN(discussionId)) {
        return res.status(400).send("Error: Invalid discussion Id");
    }
    req.discussionId = discussionId;
    next();
};
exports.requiresParsedDiscussionId = requiresParsedDiscussionId;
