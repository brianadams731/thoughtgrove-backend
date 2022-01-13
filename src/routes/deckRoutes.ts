import express from "express";
import { User } from "../models/User";
import { Deck } from "../models/Deck";
import { requireWithUserAsync } from "../middleware/requireWithUserAsync";
import {withUserAsync} from "../middleware/withUserAsync"
import { getRepository } from "typeorm";
import { IPopularDeck } from "../responseInterfaces/IPopularDeck";

const deckRouter = express.Router();

deckRouter.route("/deck/byID/:id")
    .get(withUserAsync,async(req,res)=>{
        const varifiedDeckNumber = parseInt(req.params.id);
        const deck = await Deck.findOne(varifiedDeckNumber, {
            relations:["user"]
        })
        if(!deck){
            return res.status(500).send("Error: Deck not found")
        }
        if(deck.public || req.user?.id === deck.user.id){
            return res.json(deck)            
        }
        return res.status(401).send("Error: Invalid Crendentals");
        
    }).delete(requireWithUserAsync, async(req,res)=>{
        const varifiedDeckNumber = parseInt(req.params.id);
        const deck = await Deck.findOne(varifiedDeckNumber, {
            relations:["user"]
        })
        if(req.user?.id !== deck?.user.id){
            return res.status(401).send("Error: Invalid Credentials");
        }
        const deletedDeck = await Deck.delete(varifiedDeckNumber);
        if(deletedDeck.affected === 0){
            return res.status(500).send("Error: Could not delete deck")
        }
        return res.json(deck);
    })

deckRouter.post(("/deck/add"),requireWithUserAsync,async(req,res)=>{
    const userID = req.user?.id;
    const user = await User.findOne(userID,{
        relations:["decks"]
    })

    if(!user){
        return res.status(401).send("Error: User not found");
    }

    const deck = new Deck();
    deck.title = req.body.title;    // Varify that this will be protected against a sql injection!
    deck.title = req.body.description;
    deck.public = req.body.public;

    user.decks.push(deck);
    await user.save();
    return res.json(user);
})

deckRouter.get("/deck/allByUserID/:userID",withUserAsync,async(req,res)=>{
    const validUserID = parseInt(req.params.userID);
    const userSearched = await User.findOne(validUserID, {
        relations:['decks']
    });

    if(!userSearched){
        return res.status(500).send("Error: Invalid ID");
    }
    // Filters decks, only attaches public decks, or returns users own decks
    const decks = userSearched.decks.filter(deck =>{
        return deck.public || userSearched.id === req.user?.id;
    })
    return res.json(decks);
})

deckRouter.get("/deck/popular", withUserAsync ,async(req,res)=>{
    const popularDecks:IPopularDeck[] = await getRepository(Deck).createQueryBuilder("deck")
    .select(["deck.id", "deck.title", "deck.description","user.id","user.username"/*,"votes.isUpVote"*/])
    .leftJoin("deck.user", "user")
    //.leftJoin("deck.votes", "votes")
    .where("deck.public = true")
    .getMany()

    popularDecks.forEach((item)=>{
        if(item.user.id === req.user?.id){
            item.deckRelation = "owner" 
        }else{
            item.deckRelation = "guest"
        }
    })
    
    return res.json(popularDecks);
})

export {deckRouter};