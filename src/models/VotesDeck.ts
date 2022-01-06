import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne} from "typeorm";
import { User } from "./User";
import {Deck} from "./Deck";

@Entity()
class VotesDeck extends BaseEntity{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({nullable: false})
    isUpVote: boolean;

    @ManyToOne(()=> Deck, deck => deck.votes, {
        eager:false, // Will not fetch user everytime the deck is fetched
        onDelete: 'CASCADE', // When deck gets deleted, the comment will be deleted
        nullable: false
    })
    deck: Deck;

    @ManyToOne(()=> User, user => user.votesDeck, {
        eager:false,
        onDelete: 'CASCADE', // When user gets deleted, the comment will be deleted
        nullable: false
    })
    user: User;
}

export {VotesDeck};