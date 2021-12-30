import express from "express";
import dotenv from "dotenv";

import {createConnection} from "typeorm";

import { User } from "./models/User";
import { Deck } from "./models/Deck";
import { Card } from "./models/Card";

import { loginRouter } from "./routes/loginRoutes";
import { registerRouter } from "./routes/registerRoutes";
import { deckRouter } from "./routes/deckRoutes";
import { userRouter } from "./routes/userRoutes";
import { cardRouter } from "./routes/cardRoutes"

dotenv.config();
const app = express();

createConnection({
    type: 'sqlite',
    database: "./devData/dev.db",
    logging: false,
    synchronize: true,
    entities:[User,Deck,Card]
})

app.use(express.json());

app.use(loginRouter);
app.use(registerRouter);
app.use(deckRouter);
app.use(userRouter);
app.use(cardRouter);

app.get("/", (req,res)=>{
    return res.json({indexEndpoint:"test"})
})

app.listen(process.env.PORT,()=>{
    console.log(`Server running at http://localhost:${process.env.PORT}/`)
})