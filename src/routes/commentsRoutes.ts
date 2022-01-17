import express from "express";
import { getRepository } from "typeorm";
import { requireWithUserAsync } from "../middleware/requireWithUserAsync";
import { CommentDeck } from "../models/CommentDeck";
import { Deck } from "../models/Deck";
import { User } from "../models/User";

const commentRouter = express.Router();

commentRouter.route("/comments/byID/:commentID")
    .delete(requireWithUserAsync,async(req,res)=>{
        const validCommentID = parseInt(req.params.commentID);
        const comment = await CommentDeck.findOne(validCommentID, {
            relations:["user"]
        })
        if(!comment || comment.user.id !== req.user!.id){
            return res.status(403).send("Error: Invalid Reqest")
        }
        const deleted = await CommentDeck.delete(comment.id);
        if(deleted.affected === 0){
            return res.status(500).send("Error: Could not delete comment");
        }
        return res.json(comment);
    })

commentRouter.get("/comments/byDeckID/:deckID",async(req,res)=>{
    const validDeckID = parseInt(req.params.deckID);
    const comments = await getRepository(CommentDeck).createQueryBuilder("comment")
    .select(["comment.content","comment.id","user.username","user.id"])
    .where("comment.deck.id = :deckId",{deckId:validDeckID})
    .leftJoin("comment.user", "user")
    .leftJoin("comment.deck","deck")
    .getMany()

    if(!comments){
        return res.status(500).send("Error: Invalid Deck")
    }
    
    return res.json({
        deckId: validDeckID,
        comments
    });
})


commentRouter.get("/comments/byUserID/:userID",async(req,res)=>{
    const validUserID = parseInt(req.params.userID);
    const user = await User.findOne(validUserID, {
        relations:["commentsDeck"]
    })
    if(!user){
        return res.status(403).send("Error: Invalid User")
    }
    return res.json(user.commentsDeck)

})

commentRouter.post("/comments/addComment/:deckID", requireWithUserAsync, async(req,res)=>{
    const validDeckID = parseInt(req.params.deckID);
    const deck = await Deck.findOne(validDeckID, {
        relations:["comments"]
    })

    if(!deck){
        return res.status(500).send("Error: Invalid Deck")
    }
    if(!deck.public){
        return res.status(403).send("Error: Deck is private")
    }

    const comment = new CommentDeck();
    comment.content = req.body.content;
    comment.user = req.user!;
    deck.comments.push(comment);
    await deck.save();
    return res.status(200).json({});
})
export { commentRouter };