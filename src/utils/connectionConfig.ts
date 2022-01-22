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
        GroupBulletin
    ]
}

export {connectionConfig};