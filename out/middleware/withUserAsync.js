"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withUserAsync = void 0;
const User_1 = require("../models/User");
const withUserAsync = async function (req, res, next) {
    if (!req.session.userID) {
        req.user = undefined;
        return next();
    }
    const user = await User_1.User.findOne(req.session.userID);
    if (!user) {
        req.user = undefined;
        return next();
    }
    req.user = user;
    return next();
};
exports.withUserAsync = withUserAsync;
