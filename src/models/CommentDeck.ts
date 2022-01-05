import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne} from "typeorm";
import { User } from "./User";
import {Deck} from "./Deck";

@Entity()
class CommentDeck extends BaseEntity{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({nullable: false})
    content: string;

    @ManyToOne(()=> Deck, deck => deck.comments, {
        eager:false, // Will not fetch user everytime the deck is fetched
        onDelete: 'CASCADE', // When deck gets deleted, the comment will be deleted
        nullable: false
    })
    deck: Deck;

    @ManyToOne(()=> User, user => user.commentsDeck, {
        eager:false,
        onDelete: 'CASCADE', // When user gets deleted, the comment will be deleted
        nullable: false
    })
    user: User;
}

export {CommentDeck};