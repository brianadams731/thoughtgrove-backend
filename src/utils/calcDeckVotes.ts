import { getRepository } from "typeorm"
import { VotesDeck } from "../models/VotesDeck" 
const calcDeckVotesAsync = async (deckID:number):Promise<number> =>{
    // Use aggregator to combine into one query
    const upVotes = await getRepository(VotesDeck).createQueryBuilder("votes")
    .select(["votes.isUpVote"])
    .where("votes.deck.id = :deckID and votes.isUpVote = true",{deckID})
    .getCount();

    const downVotes = await getRepository(VotesDeck).createQueryBuilder("votes")
    .select(["votes.isUpVote"])
    .where("votes.deck.id = :deckID and votes.isUpVote = false",{deckID})
    .getCount();
    
    return upVotes - downVotes
}

export { calcDeckVotesAsync };