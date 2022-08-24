"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoteState = exports.determineUserVotedOnDeckAsync = void 0;
const typeorm_1 = require("typeorm");
const VotesDeck_1 = require("../models/VotesDeck");
var VoteState;
(function (VoteState) {
    VoteState["UpVoted"] = "upVote";
    VoteState["DownVoted"] = "downVote";
    VoteState["NotVoted"] = "notVoted";
})(VoteState || (VoteState = {}));
exports.VoteState = VoteState;
const determineUserVotedOnDeckAsync = async (deckID, userID) => {
    if (!userID) {
        return VoteState.NotVoted;
    }
    const upVote = await (0, typeorm_1.getRepository)(VotesDeck_1.VotesDeck).createQueryBuilder("votes")
        .select(["votes.isUpVote"])
        .where("votes.userId = :userID and votes.deckId = :deckID", { userID, deckID })
        .getOne();
    if (upVote === undefined) {
        return VoteState.NotVoted;
    }
    if (upVote.isUpVote) {
        return VoteState.UpVoted;
    }
    else {
        return VoteState.DownVoted;
    }
};
exports.determineUserVotedOnDeckAsync = determineUserVotedOnDeckAsync;
