import express from "express";
import { User } from "../models/User";
import { Deck } from "../models/Deck";

const deckRouter = express.Router();

deckRouter.route("/deck/byID/:id")
    .get(async(req,res)=>{
        // MAKE SURE USER IS AUTHORISED TO VIEW DECK
        const varifiedDeckNumber = parseInt(req.params.id);
        const deck = await Deck.findOne(varifiedDeckNumber)
        if(!deck){
            return res.status(500).send("Error: Deck not found")
        }
        return res.json(deck)
    }).delete(async(req,res)=>{
        // TODO MAKE SURE USER IS AUTHORIZED TO DELETE DECK
        const varifiedDeckNumber = parseInt(req.params.id);
        const deck = await Deck.findOne(varifiedDeckNumber)

        const deletedDeck = await Deck.delete(varifiedDeckNumber);
        if(deletedDeck.affected === 0){
            return res.status(500).send("Error: Could not delete deck")
        }
        return res.json(deck);
    })
    // TODO add a post request here instead of the /add endpoint!!!!

    deckRouter.post(("/deck/add"),async(req,res)=>{
        const userIDPlaceholder = req.body.userIdPlaceholder;
        // TODO CHECK AUTH
        // TODO CHANGE USER
        // THIS NEED TO BE CHAGED TO WORK WITH MIDDLEWARE WHEN ADDED
        // MAKE SURE USER IS AUTORISED TO ADD DECK
        const user = await User.findOne(userIDPlaceholder,{
            relations:["decks"]
        })
        if(!user){
            return res.status(401).send("Error: User not found");
        }

        const deck = new Deck();
        deck.title = req.body.title;    // Varify that this will be protected against a sql injection!
        deck.title = req.body.description;
    
        user.decks.push(deck);
        await user.save();
        return res.json(user);
    })

    deckRouter.get("/deck/allByUserID/:userID",async(req,res)=>{
        const validUserID = parseInt(req.params.userID);
        // MAKE SURE USER IS AUTHORIZED TO VIEW DECK
        const user = await User.findOne(validUserID, {
            relations:['decks']
        });
        if(!user){
            return res.status(500).send("Error: Invalid ID");
        }
        return res.json(user.decks);
    })
export {deckRouter};