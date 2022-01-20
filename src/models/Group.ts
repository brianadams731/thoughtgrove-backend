import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany} from "typeorm";
import { GroupUser } from "./GroupUser";

@Entity()
class Group extends BaseEntity{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({nullable:false, unique:true})
    name:string;

    @Column({nullable:false})
    description:string;

    @OneToMany(()=> GroupUser, groupUser => groupUser.group,{
        nullable: false
    })
    users: GroupUser[];
}

export { Group };