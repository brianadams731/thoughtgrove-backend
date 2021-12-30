import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany} from "typeorm";
import { Deck } from "./Deck";

@Entity()
class User extends BaseEntity{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({unique:true, nullable: false})
    email: string;

    @Column({unique:true, nullable: false})
    username: string;

    @Column({nullable: false})
    password: string;

    @Column({nullable: false})
    role: string;

    @OneToMany(()=> Deck, deck => deck.user,{
        eager: false, // will not fetch every deck from user automatically
        cascade:["insert"] // when a deck is given saved to a user, it will auto insert in deck
    })
    decks: Deck[];
}

export {User};