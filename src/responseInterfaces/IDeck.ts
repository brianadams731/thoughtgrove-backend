import { Deck } from "../models/Deck";

interface IDeck extends Deck{
    deckRelation?: string;
}

export type { IDeck };