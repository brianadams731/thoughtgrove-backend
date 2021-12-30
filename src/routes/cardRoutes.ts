import express from "express";
import { Card } from "../models/Card";
import { Deck } from "../models/Deck";


const cardRouter = express.Router();

cardRouter.route('/card/byID/:cardID')
    .get(async(req,res)=>{
        const validCardID = parseInt(req.params.cardID);
        // TODO MAKE SURE CARD ID IS VALID AND USER IS AUTHERISED TO SEE IT
        const card = await Card.findOne(validCardID,{
            relations:["deck"]
        })

        if(!card){
            return res.status(500).send("Error: Card not found");
        }
        return res.json(card);
    }).delete(async(req,res)=>{
        const validCardID = parseInt(req.params.cardID);
        // TODO MAKDE SURE USE HAS AUTH TO DELETE CARD
        const card = await Card.findOne(validCardID);
        if(!card){
            return res.status(500).send("Error: Card not found");
        }
        const cardToDelete = await Card.delete(validCardID);
        if(cardToDelete.affected === 0){
            return res.status(500).send("Error: Could not delete card");
        }
        return res.json(card);
    })

cardRouter.route('/card/byDeckID/:deckID')
    .get(async (req,res)=>{
        const validDeckID = parseInt(req.params.deckID);
        const deck = await Deck.findOne(validDeckID, {
            relations:["cards"]
        });
        if(!deck){
            return res.status(500).send("Error: Deck not found")
        }
        return res.json(deck);
    }).post(async (req,res)=>{
        const validDeckID = parseInt(req.params.deckID);
        const card = new Card();
        card.front = req.body.front;
        card.back = req.body.back;

        const deck = await Deck.findOne(validDeckID,{
            relations:["cards"]
        })
        if(!deck){
            return res.status(500).send("Error: Deck not found");
        }
        deck.cards.push(card);
        await deck.save();
        return res.json(deck);
    })
export {cardRouter};