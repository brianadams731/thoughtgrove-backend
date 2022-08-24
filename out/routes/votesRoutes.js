"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.votesRouter = void 0;
const express_1 = __importDefault(require("express"));
const requireWithUserAsync_1 = require("../middleware/requireWithUserAsync");
const Deck_1 = require("../models/Deck");
const VotesDeck_1 = require("../models/VotesDeck");
const votesRouter = express_1.default.Router();
exports.votesRouter = votesRouter;
votesRouter.route("/votes/byDeckID/:deckID")
    .get(async (req, res) => {
    const validDeckID = parseInt(req.params.deckID);
    const deck = await Deck_1.Deck.findOne(validDeckID);
    if (!deck) {
        return res.status(500).send("Error: Deck not found");
    }
    const totalVotes = deck.voteCount;
    return res.json({ votes: totalVotes });
})
    .post(requireWithUserAsync_1.requireWithUserAsync, async (req, res) => {
    const validDeckID = parseInt(req.params.deckID);
    let vote = await VotesDeck_1.VotesDeck.findOne(undefined, {
        where: {
            userId: req.user.id,
            deck: {
                id: validDeckID
            }
        }
    });
    let deck = await Deck_1.Deck.findOne(validDeckID, {
        relations: ["votes"]
    });
    if (!deck) {
        return res.status(500).send("Error: Deck not found");
    }
    if (!vote) {
        vote = new VotesDeck_1.VotesDeck();
        vote.user = req.user;
        vote.isUpVote = req.body.isUpVote;
        const incrementValue = vote.isUpVote ? 1 : -1;
        deck.voteCount = deck.voteCount + incrementValue;
        deck.votes.push(vote);
        await deck.save();
        return res.status(200).json({
            isUpVote: vote.isUpVote,
            count: deck.voteCount
        });
    }
    if (vote.isUpVote === req.body.isUpVote) {
        return res.status(401).send("Error: Vote Already Cast");
    }
    else {
        vote.isUpVote = req.body.isUpVote;
        const incrementValue = vote.isUpVote ? 2 : -2;
        deck.voteCount = deck.voteCount + incrementValue;
        vote.save();
        deck.save();
        return res.status(200).json({
            isUpVote: vote.isUpVote,
            count: deck.voteCount
        });
    }
})
    .delete(requireWithUserAsync_1.requireWithUserAsync, async (req, res) => {
    const validDeckID = parseInt(req.params.deckID);
    const vote = await VotesDeck_1.VotesDeck.findOne(undefined, {
        where: {
            deck: {
                id: validDeckID
            },
            user: {
                id: req.user.id
            }
        }
    });
    if (!vote) {
        return res.status(500).send("Error: Vote not found");
    }
    const deletedVote = await VotesDeck_1.VotesDeck.delete(vote.id);
    if (deletedVote.affected === 0) {
        console.log("internal error");
        return res.status(500).send("Error: Vote not deleted");
    }
    let deck = await Deck_1.Deck.findOne(validDeckID, {
        relations: ["votes"]
    });
    if (!deck) {
        console.log("internal error");
        return res.status(500).send("Error: Deck not found");
    }
    const incrementValue = vote.isUpVote ? -1 : 1;
    deck.voteCount = deck.voteCount + incrementValue;
    deck.save();
    return res.status(200).json({
        count: deck.voteCount
    });
});
