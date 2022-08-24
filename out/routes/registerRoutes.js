"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRouter = void 0;
const express_1 = __importDefault(require("express"));
const User_1 = require("../models/User");
const parseUser_1 = require("../utils/parseUser");
const userRoles_1 = require("../utils/userRoles");
const registerRouter = express_1.default.Router();
exports.registerRouter = registerRouter;
registerRouter.post("/register", async (req, res) => {
    const parsedUser = await (0, parseUser_1.parseUserRegisterAsync)(req.body);
    let user = await User_1.User.create({
        email: parsedUser.email,
        password: parsedUser.password,
        username: parsedUser.username,
        role: userRoles_1.UserRoles.user
    }).save().catch(() => {
        res.status(500).send("Error: User exists");
    });
    req.session.userID = user.id;
    res.redirect("/");
});
