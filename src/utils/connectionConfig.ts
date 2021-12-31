import {ConnectionOptions} from "typeorm";
import { User } from "../models/User";
import { Deck } from "../models/Deck";
import { Card } from "../models/Card";

const connectionConfig: ConnectionOptions = {
    type: 'sqlite',
    database: "./devData/dev.db",
    logging: false,
    synchronize: true,
    entities:[User,Deck,Card]
}

export {connectionConfig};