import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm";

@Entity()
class User extends BaseEntity{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({unique:true, nullable: false})
    email: string;

    @Column({unique:true, nullable: false})
    username: string;

    @Column({nullable: false})
    password: string; // this is a placeholder, need to store hased check if it is type of string
}

export {User};