import express from "express";
import dotenv from "dotenv";

import { loginRouter } from "./routes/loginRoutes";
import { registerRouter } from "./routes/registerRoutes";
import { deckRouter } from "./routes/deckRoutes";
import { userRouter } from "./routes/userRoutes";

dotenv.config();
const app = express();

app.use(loginRouter);
app.use(registerRouter);
app.use(deckRouter);
app.use(userRouter);

app.get("/", (req,res)=>{
    res.json({indexEndpoint:"test"})
})

app.listen(process.env.PORT,()=>{
    console.log(`Server running at http://localhost:${process.env.PORT}/`)
})