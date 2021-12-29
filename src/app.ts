import express from "express";
import serverConfig from "./serverconfig.json";

const app = express();

app.get("/", (req,res)=>{
    res.json({indexEndpoint:"test"})
})

app.listen(serverConfig.port,()=>{
    console.log(`Server running at http://localhost:${serverConfig.port}/`)
})