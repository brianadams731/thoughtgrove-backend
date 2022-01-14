interface ICard{
    id:number,
    prompt: string,
    answer:string
}

interface ICardResponse{
    deckID:number,
    cards:ICard[]
}

export type { ICard, ICardResponse };