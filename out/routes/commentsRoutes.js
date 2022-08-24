"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentRouter = void 0;
const express_1 = __importDefault(require("express"));
const typeorm_1 = require("typeorm");
const requireWithUserAsync_1 = require("../middleware/requireWithUserAsync");
const withUserAsync_1 = require("../middleware/withUserAsync");
const CommentDeck_1 = require("../models/CommentDeck");
const Deck_1 = require("../models/Deck");
const User_1 = require("../models/User");
const commentRouter = express_1.default.Router();
exports.commentRouter = commentRouter;
commentRouter.route("/comments/byID/:commentID")
    .delete(requireWithUserAsync_1.requireWithUserAsync, async (req, res) => {
    const validCommentId = parseInt(req.params.commentID);
    const comment = await (0, typeorm_1.getRepository)(CommentDeck_1.CommentDeck).createQueryBuilder("comment")
        .select(["comment.id"])
        .where("comment.id = :commentId and comment.user.id = :userId", { commentId: validCommentId, userId: req.user ? req.user.id : -1 })
        .leftJoin("comment.user", "user")
        .getOne();
    if (!comment) {
        return res.status(403).send("Error: User not authorized");
    }
    const deleted = await CommentDeck_1.CommentDeck.delete(comment.id);
    if (deleted.affected === 0) {
        return res.status(500).send("Error: Could not delete comment");
    }
    return res.json(comment);
})
    .patch(requireWithUserAsync_1.requireWithUserAsync, async (req, res) => {
    const validCommentId = parseInt(req.params.commentID);
    if (!req.body.content) {
        return res.status(400).send("Error: Malformed comment edit");
    }
    const comment = await (0, typeorm_1.getConnection)().createQueryBuilder()
        .update(CommentDeck_1.CommentDeck)
        .set({ content: req.body.content })
        .where("id = :commentId and user.id = :userId", { commentId: validCommentId, userId: req.user ? req.user.id : -1 })
        .execute();
    if (comment.affected === 0) {
        return res.status(403).send("Error: Comment not edited");
    }
    return res.status(200).json({});
});
commentRouter.get("/comments/byDeckID/:deckID", withUserAsync_1.withUserAsync, async (req, res) => {
    const validDeckID = parseInt(req.params.deckID);
    const comments = await (0, typeorm_1.getRepository)(CommentDeck_1.CommentDeck).createQueryBuilder("comment")
        .select(["comment.content", "comment.id", "user.username", "user.id"])
        .where("comment.deck.id = :deckId", { deckId: validDeckID })
        .leftJoin("comment.user", "user")
        .leftJoin("comment.deck", "deck")
        .getMany();
    if (!comments) {
        return res.status(500).send("Error: Invalid Deck");
    }
    const retComments = {
        deckId: validDeckID,
        comments: comments.map(item => ({
            ...item,
            userOwnsComment: req.user?.id ? (item.user.id === req.user?.id) : false
        }))
    };
    return res.json(retComments);
});
commentRouter.get("/comments/byUserID/:userID", async (req, res) => {
    const validUserID = parseInt(req.params.userID);
    const user = await User_1.User.findOne(validUserID, {
        relations: ["commentsDeck"]
    });
    if (!user) {
        return res.status(403).send("Error: Invalid User");
    }
    return res.json(user.commentsDeck);
});
commentRouter.post("/comments/addComment/:deckID", requireWithUserAsync_1.requireWithUserAsync, async (req, res) => {
    if (!req.body.content) {
        return res.status(400).send("Error: No Content in Comment");
    }
    const validDeckID = parseInt(req.params.deckID);
    const deck = await Deck_1.Deck.findOne(validDeckID, {
        relations: ["comments"]
    });
    if (!deck) {
        return res.status(500).send("Error: Invalid Deck");
    }
    if (!deck.public) {
        return res.status(403).send("Error: Deck is private");
    }
    const comment = new CommentDeck_1.CommentDeck();
    comment.content = req.body.content;
    comment.user = req.user;
    deck.comments.push(comment);
    await deck.save();
    return res.status(200).json({});
});
