import express from "express";
import { User } from "../models/User";
import { Deck } from "../models/Deck";
import { requireWithUserAsync } from "../middleware/requireWithUserAsync";
import {withUserAsync} from "../middleware/withUserAsync"
import { getRepository } from "typeorm";
import { IDeck } from "../responseInterfaces/IDeck";
import { mapDeckRelation } from "../utils/mapDeckRelation";
import { calcDeckVotesAsync } from "../utils/calcDeckVotes";
import { determineUserVotedOnDeckAsync, VoteState } from "../utils/detrmineUserVotedOnDeck";

const deckRouter = express.Router();

deckRouter.route("/deck/byID/:id")
    .get(withUserAsync,async(req,res)=>{
        const verifiedDeckNumber = parseInt(req.params.id);        

        const deck: IDeck|undefined = await getRepository(Deck).createQueryBuilder("deck")
        .select(["deck.id", "deck.title", "deck.subject", "deck.description", "user.id", "user.username"/*,"votes.isUpVote"*/])
        .leftJoin("deck.user", "user")
        .where("deck.id = :deckID and (deck.public = true or user.id = :userID)",{deckID: verifiedDeckNumber, userID: req.user? req.user.id : -1})
        .getOne()
        
        if(!deck){
            return res.status(500).send("Error: Deck not found")
        }

        deck.deckRelation = mapDeckRelation(deck, req.user);
        deck.vote = {
            count: await calcDeckVotesAsync(deck.id),
            voteCast: await determineUserVotedOnDeckAsync(req.user?.id)
        }
        return res.json(deck) ;

    }).delete(requireWithUserAsync, async(req,res)=>{
        const verifiedDeckNumber = parseInt(req.params.id);
        const deck = await Deck.findOne(verifiedDeckNumber, {
            relations:["user"]
        })
        if(req.user?.id !== deck?.user.id){
            return res.status(401).send("Error: Invalid Credentials");
        }

        const deletedDeck = await Deck.delete(verifiedDeckNumber);
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
    deck.title = req.body.title;    // Verify that this will be protected against a sql injection!
    deck.subject = req.body.subject;
    deck.description = req.body.description;
    deck.public = req.body.public;

    user.decks.push(deck);
    await user.save();
    return res.json(deck);
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
    // TODO ADD VOTE COUNTER
    const popularDecks:IDeck[] = await getRepository(Deck).createQueryBuilder("deck")
    .select(["deck.id", "deck.title", "deck.subject", "deck.description", "user.id", "user.username"])
    .leftJoin("deck.user", "user")
    .where("deck.public = true")
    .getMany()

    popularDecks.forEach((item)=>{
        item.deckRelation = mapDeckRelation(item,req.user);
    })

    //TODO: this is inefficient implement a better solution
    for(const deck of popularDecks){
        deck.vote = {
            count: await calcDeckVotesAsync(deck.id),
            voteCast: VoteState.NotVoted, // this value is not used by this endpoint
        }
    }

    return res.json(popularDecks);
})

deckRouter.get("/deck/owner", requireWithUserAsync, async(req,res)=>{
    // TODO ADD VOTE COUNTER
    const decks: IDeck[] = await getRepository(Deck).createQueryBuilder("deck")
    .select(["deck.id", "deck.title", "deck.subject", "deck.description","user.id","user.username"])
    .leftJoin("deck.user", "user")
    .where("deck.user.id = :userID",{userID: req.user?.id? req.user.id:-1})
    .getMany();

    decks.forEach((item)=>{
        item.deckRelation = "owner";
    })

    //TODO: this is inefficient implement a better solution, look at popular decks
    for(const deck of decks){
        deck.vote = {
            count: await calcDeckVotesAsync(deck.id),
            voteCast: await determineUserVotedOnDeckAsync(req.user?.id),
        }
    }    
    return res.json(decks);

})
export {deckRouter};