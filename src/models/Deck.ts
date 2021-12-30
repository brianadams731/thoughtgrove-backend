import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, OneToMany} from "typeorm";
import { Card } from "./Card";
import { User } from "./User";

@Entity()
class Deck extends BaseEntity{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({nullable: false})
    title: string;

    @Column({nullable: true})
    description: string;

    @ManyToOne(()=> User, user => user.decks, {
        eager:false, // Will not fetch user everytime the deck is fetched
        onDelete: 'CASCADE', // When user gets deleted, the deck will be deleted
    })
    user: User;

    @OneToMany(()=>Card, card => card.deck, {
        eager:false,
        cascade:["insert"] // When cards get inserted into the deck, they will atuomatically be inserted in card table
    })
    cards: Card[];
}

export {Deck};