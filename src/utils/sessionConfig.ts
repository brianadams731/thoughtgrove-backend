import { SessionOptions, MemoryStore } from "express-session";
import dotenv from "dotenv";
import { v4 as uuidv4 } from 'uuid';
dotenv.config();

// USED TO ADD FIELDS TO SESSION OBJECT ie req.session.userID!
/*declare module "express-session" {
    interface Session {
        userID: number;
    }
*/

const sessionConfig: SessionOptions  = {
    name: "userSession",
    secret: process.env.COOKIE_SECRET as string,
    resave: false,
    saveUninitialized: false,
    store: new MemoryStore,
    genid: function(req){
        return uuidv4();
    },
}


export {sessionConfig};