"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireWithUserAsync = void 0;
const User_1 = require("../models/User");
const requireWithUserAsync = async function (req, res, next) {
    if (!req.session.userID) {
        res.status(401).send("Error: Invalid Credentials");
        return;
    }
    const user = await User_1.User.findOne(req.session.userID);
    if (!user) {
        res.status(401).send("Error: Invalid Credentials");
        return;
    }
    req.user = user;
    next();
};
exports.requireWithUserAsync = requireWithUserAsync;
