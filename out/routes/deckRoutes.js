"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deckRouter = void 0;
const express_1 = __importDefault(require("express"));
const User_1 = require("../models/User");
const Deck_1 = require("../models/Deck");
const requireWithUserAsync_1 = require("../middleware/requireWithUserAsync");
const withUserAsync_1 = require("../middleware/withUserAsync");
const typeorm_1 = require("typeorm");
const mapDeckRelation_1 = require("../utils/mapDeckRelation");
const detrmineUserVotedOnDeck_1 = require("../utils/detrmineUserVotedOnDeck");
const deckRouter = express_1.default.Router();
exports.deckRouter = deckRouter;
deckRouter.route("/deck/byID/:id")
    .get(withUserAsync_1.withUserAsync, async (req, res) => {
    const verifiedDeckNumber = parseInt(req.params.id);
    const deck = await (0, typeorm_1.getRepository)(Deck_1.Deck).createQueryBuilder("deck")
        .select(["deck.id", "deck.title", "deck.subject", "deck.description", "deck.voteCount", "user.id", "user.username"])
        .leftJoin("deck.user", "user")
        .where("deck.id = :deckID and (deck.public = true or user.id = :userID)", { deckID: verifiedDeckNumber, userID: req.user ? req.user.id : -1 })
        .getOne();
    if (!deck) {
        return res.status(500).send("Error: Deck not found");
    }
    deck.deckRelation = (0, mapDeckRelation_1.mapDeckRelation)(deck, req.user);
    deck.vote = {
        count: deck.voteCount,
        voteCast: await (0, detrmineUserVotedOnDeck_1.determineUserVotedOnDeckAsync)(deck.id, req.user?.id)
    };
    return res.json(deck);
}).delete(requireWithUserAsync_1.requireWithUserAsync, async (req, res) => {
    const verifiedDeckNumber = parseInt(req.params.id);
    const deck = await Deck_1.Deck.findOne(verifiedDeckNumber, {
        relations: ["user"]
    });
    if (req.user?.id !== deck?.user.id) {
        return res.status(401).send("Error: Invalid Credentials");
    }
    const deletedDeck = await Deck_1.Deck.delete(verifiedDeckNumber);
    if (deletedDeck.affected === 0) {
        return res.status(500).send("Error: Could not delete deck");
    }
    return res.json(deck);
}).patch(requireWithUserAsync_1.requireWithUserAsync, async (req, res) => {
    const verifiedDeckNumber = parseInt(req.params.id);
    // TODO: Refactor this into update style
    const deck = await (0, typeorm_1.getRepository)(Deck_1.Deck).createQueryBuilder("deck")
        .leftJoin("deck.user", "user")
        .where("deck.id = :deckID and user.id = :userID", { deckID: verifiedDeckNumber, userID: req.user ? req.user.id : -1 })
        .getOne();
    if (!deck) {
        console.log("on deck");
        return res.status(500).send("Error: Could not find deck");
    }
    deck.subject = req.body.subject;
    deck.title = req.body.title;
    deck.description = req.body.description;
    deck.public = req.body.public;
    deck.save();
    return res.status(200).send();
});
deckRouter.post(("/deck/add"), requireWithUserAsync_1.requireWithUserAsync, async (req, res) => {
    const userID = req.user?.id;
    const user = await User_1.User.findOne(userID, {
        relations: ["decks"]
    });
    if (!user) {
        return res.status(401).send("Error: User not found");
    }
    const deck = new Deck_1.Deck();
    deck.title = req.body.title; // Verify that this will be protected against a sql injection!
    deck.subject = req.body.subject;
    deck.description = req.body.description;
    deck.public = req.body.public;
    deck.voteCount = 0;
    user.decks.push(deck);
    await user.save();
    return res.json(deck);
});
deckRouter.get("/deck/allByUserID/:userID", withUserAsync_1.withUserAsync, async (req, res) => {
    const validUserID = parseInt(req.params.userID);
    const userSearched = await User_1.User.findOne(validUserID, {
        relations: ['decks']
    });
    if (!userSearched) {
        return res.status(500).send("Error: Invalid ID");
    }
    // Filters decks, only attaches public decks, or returns users own decks
    const decks = userSearched.decks.filter(deck => {
        return deck.public || userSearched.id === req.user?.id;
    });
    return res.json(decks);
});
deckRouter.get("/deck/popular", withUserAsync_1.withUserAsync, async (req, res) => {
    const popularDecks = await (0, typeorm_1.getRepository)(Deck_1.Deck).createQueryBuilder("deck")
        .select(["deck.id", "deck.title", "deck.subject", "deck.description", "deck.voteCount", "user.id", "user.username"])
        .leftJoin("deck.user", "user")
        .where("deck.public = true")
        .getMany();
    popularDecks.forEach((item) => {
        item.deckRelation = (0, mapDeckRelation_1.mapDeckRelation)(item, req.user);
    });
    for (const deck of popularDecks) {
        deck.vote = {
            count: deck.voteCount,
            voteCast: detrmineUserVotedOnDeck_1.VoteState.NotVoted, // this value is not used by this endpoint
        };
    }
    return res.json(popularDecks);
});
deckRouter.get("/deck/owner", requireWithUserAsync_1.requireWithUserAsync, async (req, res) => {
    const decks = await (0, typeorm_1.getRepository)(Deck_1.Deck).createQueryBuilder("deck")
        .select(["deck.id", "deck.title", "deck.subject", "deck.voteCount", "deck.description", "user.id", "user.username"])
        .leftJoin("deck.user", "user")
        .where("deck.user.id = :userID", { userID: req.user?.id ? req.user.id : -1 })
        .getMany();
    decks.forEach((item) => {
        item.deckRelation = "owner";
    });
    for (const deck of decks) {
        deck.vote = {
            count: deck.voteCount,
            voteCast: await (0, detrmineUserVotedOnDeck_1.determineUserVotedOnDeckAsync)(deck.id, req.user?.id),
        };
    }
    return res.json(decks);
});
