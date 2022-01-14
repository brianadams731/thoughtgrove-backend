import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne} from "typeorm";
import { Deck } from "./Deck";


@Entity()
class Card extends BaseEntity{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({nullable: true})
    prompt: string;

    @Column({nullable: true})
    answer: string;

    @ManyToOne(()=> Deck, deck => deck.cards, {
        eager: false, // will not fetch deck with every card
        onDelete: 'CASCADE' // When deck is deleted all the cards will be deleted
    })
    deck: Deck;
}

export {Card};