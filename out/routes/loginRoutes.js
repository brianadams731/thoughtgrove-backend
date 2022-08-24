"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginRouter = void 0;
const express_1 = __importDefault(require("express"));
const User_1 = require("../models/User");
const passwordHash_1 = require("../utils/passwordHash");
const loginRouter = express_1.default.Router();
exports.loginRouter = loginRouter;
loginRouter.route("/login")
    .post(async (req, res) => {
    const loginCred = req.body;
    const user = await User_1.User.findOne({
        select: ["email", "password", "id"],
        where: { email: loginCred.email }
    });
    // Checking for user ahead to save hashing against an invalid user
    if (!user) {
        return res.status(401).send("Error: Invalid Credentials");
    }
    const isValidPassword = await (0, passwordHash_1.checkHashedPasswordAsync)(loginCred.password, user.password);
    if (!isValidPassword) {
        return res.status(401).send("Error: Invalid Credentials");
    }
    else {
        req.session.userID = user.id;
        return res.status(200).send("Good");
    }
});
