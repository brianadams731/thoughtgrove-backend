"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutRouter = void 0;
const express_1 = __importDefault(require("express"));
const logoutRouter = express_1.default.Router();
exports.logoutRouter = logoutRouter;
logoutRouter.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send("Error: Cannot Log out");
        }
        return res.send("logged out");
    });
});
