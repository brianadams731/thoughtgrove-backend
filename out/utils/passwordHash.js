"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkHashedPasswordAsync = exports.generateHashedPasswordAsync = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const generateHashedPasswordAsync = async (password) => {
    return await bcrypt_1.default.hash(password, 10);
};
exports.generateHashedPasswordAsync = generateHashedPasswordAsync;
const checkHashedPasswordAsync = async (plainTextPassword, hashedPassword) => {
    return await bcrypt_1.default.compare(plainTextPassword, hashedPassword);
};
exports.checkHashedPasswordAsync = checkHashedPasswordAsync;
