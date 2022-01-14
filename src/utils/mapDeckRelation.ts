import { Deck } from "../models/Deck"
import { User } from "../models/User"

const mapDeckRelation = (deck:Deck, user?:User):string =>{
    if(!user){
        return "guest";
    }

    if(deck.user.id === user.id){
        return "owner";
    }else if(deck.user.id !== user.id){
        return "guest";
    }else{
        return "error";
    }
}

export { mapDeckRelation };