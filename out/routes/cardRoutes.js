"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cardRouter = void 0;
const express_1 = __importDefault(require("express"));
const typeorm_1 = require("typeorm");
const requireWithUserAsync_1 = require("../middleware/requireWithUserAsync");
const withUserAsync_1 = require("../middleware/withUserAsync");
const Card_1 = require("../models/Card");
const Deck_1 = require("../models/Deck");
const cardRouter = express_1.default.Router();
exports.cardRouter = cardRouter;
// Are these routes needed?
cardRouter.route('/card/byID/:cardID')
    .get(withUserAsync_1.withUserAsync, async (req, res) => {
    const validCardID = parseInt(req.params.cardID);
    const card = await Card_1.Card.findOne(validCardID, {
        relations: ["deck", "deck.user"]
    });
    if (!card) {
        return res.status(500).send("Error: Card not found");
    }
    if (req?.user?.id === card.deck.user.id || card.deck.public) {
        return res.json(card);
    }
    return res.status(403).send("Error: Invalid Credentials");
}).delete(requireWithUserAsync_1.requireWithUserAsync, async (req, res) => {
    const validCardID = parseInt(req.params.cardID);
    const card = await Card_1.Card.findOne(validCardID, {
        relations: ["deck", "deck.user"]
    });
    if (!card) {
        return res.status(404).send("Error: Invalid Card");
    }
    if (card?.deck?.user?.id !== req.user?.id) {
        return res.status(403).send("Error: Not authorized");
    }
    const cardToDelete = await Card_1.Card.delete(validCardID);
    if (cardToDelete.affected === 0) {
        return res.status(500).send("Error: Could not delete card");
    }
    return res.json(card);
}).patch(requireWithUserAsync_1.requireWithUserAsync, async (req, res) => {
    const validCardID = parseInt(req.params.cardID);
    // TODO: Refactor this into update style found in comment and discussion route!
    const card = await (0, typeorm_1.getRepository)(Card_1.Card).createQueryBuilder("card")
        .leftJoin("card.deck", "deck")
        .leftJoin("deck.user", "user")
        .where("card.id = :cardID and user.id = :userID", { cardID: validCardID, userID: req.user ? req.user.id : -1 })
        .getOne();
    if (!card) {
        console.log("Card not found");
        return res.status(500).send("Error: Card not found");
    }
    card.prompt = req.body.prompt;
    card.answer = req.body.answer;
    card.save();
    return res.status(200).send();
});
cardRouter.route('/card/byDeckID/:deckID')
    .get(withUserAsync_1.withUserAsync, withUserAsync_1.withUserAsync, async (req, res) => {
    const validDeckID = parseInt(req.params.deckID);
    const selectedDeck = await (0, typeorm_1.getRepository)(Deck_1.Deck).createQueryBuilder("deck")
        .select(["card.id", "card.prompt", "card.answer", "deck.id"])
        .where("deck.id = :deckID and (deck.user.id = :userID or deck.public = true)", { deckID: validDeckID, userID: req.user ? req.user.id : -1 })
        .leftJoin("deck.cards", "card")
        .getOne();
    if (!selectedDeck) {
        return res.status(500).send("Error: No Cards Found");
    }
    const cards = {
        deckID: selectedDeck.id,
        cards: selectedDeck.cards
    };
    res.json(cards);
}).post(requireWithUserAsync_1.requireWithUserAsync, async (req, res) => {
    const validDeckID = parseInt(req.params.deckID);
    const deck = await Deck_1.Deck.findOne(validDeckID, {
        relations: ["cards", "user"]
    });
    if (!deck) {
        return res.status(500).send("Error: Deck not found");
    }
    if (deck.user.id !== req.user?.id) {
        return res.status(403).send("Error: Invalid Credentials");
    }
    const card = new Card_1.Card();
    card.prompt = req.body.prompt;
    card.answer = req.body.answer;
    deck.cards.push(card);
    await deck.save();
    return res.json(card);
});
