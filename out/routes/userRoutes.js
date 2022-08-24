"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const requireWithUserAsync_1 = require("../middleware/requireWithUserAsync");
const User_1 = require("../models/User");
const userRouter = express_1.default.Router();
exports.userRouter = userRouter;
userRouter.get("/user/byID/:id", async (req, res) => {
    const userID = parseInt(req.params.id);
    const person = await User_1.User.findOne(userID);
    if (!person) {
        return res.status(404).send("no such record exists");
    }
    return res.json(person);
});
userRouter.get("/user/owner", requireWithUserAsync_1.requireWithUserAsync, async (req, res) => {
    return res.json({
        id: req.user?.id,
        email: req.user?.email,
        username: req.user?.username,
        role: req.user?.role
    });
});
userRouter.delete("/user/delete", requireWithUserAsync_1.requireWithUserAsync, async (req, res) => {
    const userToDelete = req.user;
    if (!userToDelete) {
        return res.status(500).send("Error: Could not delete user");
    }
    const user = await User_1.User.delete(userToDelete.id);
    if (user.affected == 0) {
        return res.status(500).send("Error: Could not delete user");
    }
    return res.json(userToDelete);
});
