import express from "express";
import { requireWithUserAsync } from "../middleware/requireWithUserAsync";
import { withUserAsync } from "../middleware/withUserAsync";
import { Card } from "../models/Card";
import { Deck } from "../models/Deck";


const cardRouter = express.Router();

cardRouter.route('/card/byID/:cardID')
    .get(withUserAsync, async(req,res)=>{
        const validCardID = parseInt(req.params.cardID);
        const card = await Card.findOne(validCardID,{
            relations:["deck", "deck.user"]
        })
        if(!card){
            return res.status(500).send("Error: Card not found");
        }
        if(req?.user?.id === card.deck.user.id || card.deck.public){
            return res.json(card);            
        }
        return res.status(403).send("Error: Invalid Credentials");
    }).delete(requireWithUserAsync ,async(req,res)=>{
        const validCardID = parseInt(req.params.cardID);
        const card = await Card.findOne(validCardID, {
            relations:["deck", "deck.user"]
        });
        if(!card){
            return res.status(404).send("Error: Invalid Card");
        }
        if(card?.deck?.user?.id !== req.user?.id){
            return res.status(403).send("Error: Not authroized");
        }
        const cardToDelete = await Card.delete(validCardID);
        if(cardToDelete.affected === 0){
            return res.status(500).send("Error: Could not delete card");
        }
        return res.json(card);
    })

cardRouter.route('/card/byDeckID/:deckID')
    .get(withUserAsync,async (req,res)=>{
        const validDeckID = parseInt(req.params.deckID);
        const deck = await Deck.findOne(validDeckID, {
            relations:["cards", "user"]
        });
        if(!deck){
            return res.status(500).send("Error: Deck not found");
        }
        if(deck.public || deck.user.id === req.user?.id){
            return res.json(deck);
        }
        return res.status(403).send("Error: Invalid Credentials");
        
    }).post(requireWithUserAsync ,async (req,res)=>{
        const validDeckID = parseInt(req.params.deckID);
        const deck = await Deck.findOne(validDeckID,{
            relations:["cards", "user"]
        })
        if(!deck){
            return res.status(500).send("Error: Deck not found");
        }
        if(deck.user.id !== req.user?.id ){
            return res.status(403).send("Error: Invalid Credentials")
        }
        const card = new Card();
        card.front = req.body.front;
        card.back = req.body.back;

        deck.cards.push(card);
        await deck.save();
        return res.json(deck);
    })

export {cardRouter};