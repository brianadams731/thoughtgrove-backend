import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm";

@Entity()
class User extends BaseEntity{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    email: string;

    @Column()
    username: string;

    @Column()
    password: string; // this is a placeholder, need to store hased check if it is type of string
}

export {User};