import {ConnectionOptions} from "typeorm";
import { User } from "../models/User";
import { Deck } from "../models/Deck";
import { Card } from "../models/Card";
import { CommentDeck } from "../models/CommentDeck";
import { VotesDeck } from "../models/VotesDeck";
import { GroupUser } from "../models/GroupUser";
import { Group } from "../models/Group";
import { GroupDiscussion } from "../models/GroupDiscussion";
import { GroupBulletin } from "../models/GroupBulletin";
import { DiscussionComment } from "../models/DiscussionComment";

import dotenv from "dotenv";

dotenv.config();
const connectionConfig: ConnectionOptions = {
    type: 'postgres',
    database: "./devData/dev.db",
    url: process.env.DATABASE_URL,
    logging: false,
    synchronize: true,
    ssl: process.env.NODE_ENV !== "DEV",
    extra: process.env.NODE_ENV === "DEV"? {}:{
        ssl: {
          rejectUnauthorized: false
        }
    },
    entities:[
        User,
        Deck,
        Card,
        CommentDeck,
        VotesDeck,
        Group,
        GroupUser,
        GroupDiscussion,
        GroupBulletin,
        DiscussionComment
    ],
}

/*
const connectionConfig: ConnectionOptions = {
    type: 'sqlite',
    database: "./devData/dev.db",
    logging: false,
    synchronize: true,
    entities:[
        User,
        Deck,
        Card,
        CommentDeck,
        VotesDeck,
        Group,
        GroupUser,
        GroupDiscussion,
        GroupBulletin,
        DiscussionComment
    ]
}
*/
export {connectionConfig};