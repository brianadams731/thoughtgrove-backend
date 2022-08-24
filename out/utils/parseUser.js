"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseUserRegisterAsync = void 0;
const passwordHash_1 = require("./passwordHash");
const parseUserRegisterAsync = async (request) => {
    let user = {};
    user.email = request.email.toLowerCase(); // TODO consider verifying email
    user.password = await (0, passwordHash_1.generateHashedPasswordAsync)(request.password);
    user.username = request.username;
    return user;
};
exports.parseUserRegisterAsync = parseUserRegisterAsync;
