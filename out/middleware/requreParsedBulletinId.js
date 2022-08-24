"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requiresParsedBulletinId = void 0;
const requiresParsedBulletinId = (req, res, next) => {
    const bulletinId = parseInt(req.params.bulletinId);
    if (isNaN(bulletinId)) {
        return res.status(400).send("Error: Invalid Bulletin Id");
    }
    req.bulletinId = bulletinId;
    next();
};
exports.requiresParsedBulletinId = requiresParsedBulletinId;
