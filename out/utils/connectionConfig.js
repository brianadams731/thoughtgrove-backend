"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectionConfig = void 0;
const User_1 = require("../models/User");
const Deck_1 = require("../models/Deck");
const Card_1 = require("../models/Card");
const CommentDeck_1 = require("../models/CommentDeck");
const VotesDeck_1 = require("../models/VotesDeck");
const GroupUser_1 = require("../models/GroupUser");
const Group_1 = require("../models/Group");
const GroupDiscussion_1 = require("../models/GroupDiscussion");
const GroupBulletin_1 = require("../models/GroupBulletin");
const DiscussionComment_1 = require("../models/DiscussionComment");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const connectionConfig = {
    type: 'postgres',
    database: "./devData/dev.db",
    url: process.env.DATABASE_URL,
    logging: false,
    synchronize: true,
    ssl: process.env.NODE_ENV !== "DEV",
    extra: process.env.NODE_ENV === "DEV" ? {} : {
        ssl: {
            rejectUnauthorized: false
        }
    },
    entities: [
        User_1.User,
        Deck_1.Deck,
        Card_1.Card,
        CommentDeck_1.CommentDeck,
        VotesDeck_1.VotesDeck,
        Group_1.Group,
        GroupUser_1.GroupUser,
        GroupDiscussion_1.GroupDiscussion,
        GroupBulletin_1.GroupBulletin,
        DiscussionComment_1.DiscussionComment
    ],
};
exports.connectionConfig = connectionConfig;
