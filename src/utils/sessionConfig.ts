import session, { SessionOptions } from "express-session";
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
    cookie: { maxAge: 10 * 24 * 60 * 60 * 1000 },
    store: new (require("connect-pg-simple")(session))({
        conObject: {
            connectionString: process.env.DATABASE_URL,
            ssl: process.env.NODE_ENV !== "DEV"?{
                rejectUnauthorized: false,
            }:false,
        },
        createTableIfMissing: true,
    }),
    genid: function(req){
        return uuidv4();
    },
}


export {sessionConfig};