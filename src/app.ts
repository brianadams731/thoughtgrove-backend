import express from "express";
import dotenv from "dotenv";
import session from 'express-session';
import {createConnection} from "typeorm";

import { sessionConfig } from "./utils/sessionConfig";
import { connectionConfig } from "./utils/connectionConfig";

import { loginRouter } from "./routes/loginRoutes";
import { registerRouter } from "./routes/registerRoutes";
import { deckRouter } from "./routes/deckRoutes";
import { userRouter } from "./routes/userRoutes";
import { cardRouter } from "./routes/cardRoutes"
import { logoutRouter } from "./routes/logoutRoutes";
import { commentRouter } from "./routes/commentsRoutes";
import { votesRouter } from "./routes/votesRoutes";
import { groupRoutes } from "./routes/groupRoutes";
import { discussionRoutes } from "./routes/disscussionRoutes";

dotenv.config();

const app = express();
createConnection(connectionConfig);
app.use(session(sessionConfig));
app.use(express.json());

app.use(loginRouter);
app.use(registerRouter);
app.use(deckRouter);
app.use(userRouter);
app.use(cardRouter);
app.use(logoutRouter);
app.use(commentRouter);
app.use(votesRouter);
app.use(groupRoutes);
app.use(discussionRoutes);

app.get("/", (req,res)=>{
    return res.send("test endpoint")
})

app.listen(process.env.PORT,()=>{
    console.log(`Server running at http://localhost:${process.env.PORT}/`)
})