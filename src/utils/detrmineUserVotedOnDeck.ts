import { getRepository } from "typeorm";
import { VotesDeck } from "../models/VotesDeck";

enum VoteState{
    UpVoted = "upVote",
    DownVoted = "downVote",
    NotVoted = "notVoted"
}

const determineUserVotedOnDeckAsync = async(userID?:number):Promise<VoteState> =>{
    if(!userID){
        return VoteState.NotVoted;
    }
    const upVote = await getRepository(VotesDeck).createQueryBuilder("votes")
    .select(["votes.isUpVote"])
    .where("votes.userId = :userID",{userID})
    .getOne();

    console.log(upVote)
    if(upVote === undefined){
        return VoteState.NotVoted
    }

    if(upVote.isUpVote){
        return VoteState.UpVoted
    }else{
        return VoteState.DownVoted
    }
}

export { determineUserVotedOnDeckAsync, VoteState };