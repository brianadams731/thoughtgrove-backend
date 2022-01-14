import express from "express";
import { requireWithUserAsync } from "../middleware/requireWithUserAsync";
import { Deck } from "../models/Deck";
import { VotesDeck } from "../models/VotesDeck";

const votesRouter = express.Router();

const countVotes = async (deckID:number):Promise<number> =>{
    const upVotes = await VotesDeck.count({
        where:{
            isUpVote:true,
            deck:{
                id:deckID
            }
        }
    })
    const downVotes = await VotesDeck.count({
        where:{
            isUpVote:false,
            deck:{
                id:deckID
            }
        }
    })
    return upVotes - downVotes;
}

// Checks if user already voted, if so removes the vote, if vote is identical returns true (double clicked upvote or downvote)
const removeDuplicateVote = async(userID:number, deckID:number, voteType:boolean):Promise<boolean> =>{
    const vote = await VotesDeck.findOne({
        where:{
            deck:{
                id: deckID
            },
            user:{
                id: userID
            }
        }
    })
    if(!vote){
        return false
    }
    // TODO REFACTOR!!!!
    const deletedVote = await VotesDeck.delete(vote.id);
    if(deletedVote.affected === 0){
        console.log("ERROR!!! VOTE NOTE DELETED")
    }
    if(vote.isUpVote === voteType){
        return true;
    }
    return false;
}

votesRouter.route("/votes/byDeckID/:deckID")
    .get(async(req,res)=>{
        const validDeckID = parseInt(req.params.deckID);
        const totalVotes = await countVotes(validDeckID);
        return res.json({votes:totalVotes});
    })
    .post(requireWithUserAsync, async(req,res)=>{
        const validDeckID = parseInt(req.params.deckID);
        const identicalVote = await removeDuplicateVote(req.user!.id,validDeckID, req.body.isUpVote)
        if(identicalVote){
            const totalVotes = await countVotes(validDeckID);
            return res.json({votes:totalVotes});
        }
        // TODO REFACTOR THIS IS INEFFICIENT AS IT DELETES THE IDENTICAL VOTE
        const deck = await Deck.findOne(validDeckID,{
            relations:["votes"]
        })
        if(!deck){
            return res.status(403).send("Error: Deck not found");
        }
        
        const vote = new VotesDeck();
        vote.user = req.user!;
        vote.isUpVote = req.body.isUpVote;
        deck.votes.push(vote);
        await deck.save();
        const totalVotes = await countVotes(validDeckID);
        return res.json({votes:totalVotes});
    })
    .delete(requireWithUserAsync, async(req,res)=>{
        const validDeckID = parseInt(req.params.deckID)
        const vote = await VotesDeck.findOne(undefined,{
            where:{
                deck:{
                    id: validDeckID
                },
                user:{
                    id: req.user!.id
                }
            }
        })
        if(!vote){
            return res.status(500).send("Error: Vote not found");
        }
        const deletedVote = await VotesDeck.delete(vote.id);
        if(deletedVote.affected === 0){
            return res.status(500).send("Error: Vote not deleted");
        }
        const parsedRes = await res.json();
        return res.json(parsedRes);
    })

export {votesRouter};