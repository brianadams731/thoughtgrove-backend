import { Deck } from "../models/Deck";

interface IPopularDeck extends Deck{
    deckRelation?: string;
}

export type { IPopularDeck };