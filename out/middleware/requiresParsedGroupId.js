"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requiresParsedGroupId = void 0;
const requiresParsedGroupId = (req, res, next) => {
    const groupId = parseInt(req.params.groupId);
    if (isNaN(groupId)) {
        return res.status(400).send("Error: Invalid Group Id");
    }
    req.groupId = groupId;
    next();
};
exports.requiresParsedGroupId = requiresParsedGroupId;
