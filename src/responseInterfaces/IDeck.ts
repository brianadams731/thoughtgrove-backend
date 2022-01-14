import { Deck } from "../models/Deck";
import { VoteState } from "../utils/detrmineUserVotedOnDeck";

interface IDeck extends Deck{
    deckRelation?: string;
    vote?:{
        count:number;
        voteCast: VoteState;
    }
}

export type { IDeck };