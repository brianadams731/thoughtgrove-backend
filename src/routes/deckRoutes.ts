import express from "express";

const deckRouter = express.Router();

deckRouter.route("/deck/byID/:id")
    .get((req,res)=>{
        res.send(`deck id: ${req.params.id}`);
    })

export {deckRouter};