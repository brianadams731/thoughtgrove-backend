import {ConnectionOptions} from "typeorm";
import { User } from "../models/User";
import { Deck } from "../models/Deck";
import { Card } from "../models/Card";
import { CommentDeck } from "../models/CommentDeck";
import { VotesDeck } from "../models/VotesDeck";

const connectionConfig: ConnectionOptions = {
    type: 'sqlite',
    database: "./devData/dev.db",
    logging: false,
    synchronize: true,
    entities:[User,Deck,Card, CommentDeck, VotesDeck]
}

export {connectionConfig};