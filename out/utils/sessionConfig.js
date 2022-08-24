"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionConfig = void 0;
const express_session_1 = require("express-session");
const dotenv_1 = __importDefault(require("dotenv"));
const uuid_1 = require("uuid");
dotenv_1.default.config();
// USED TO ADD FIELDS TO SESSION OBJECT ie req.session.userID!
/*declare module "express-session" {
    interface Session {
        userID: number;
    }
*/
const sessionConfig = {
    name: "userSession",
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new express_session_1.MemoryStore,
    genid: function (req) {
        return (0, uuid_1.v4)();
    },
};
exports.sessionConfig = sessionConfig;
