import {Entity, PrimaryGeneratedColumn, Column, BaseEntity,  ManyToOne} from "typeorm";
import { Group } from "./Group";
import { User } from "./User";

@Entity()
class GroupUser extends BaseEntity{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({nullable:false})
    role: "owner"|"moderator"|"user"|"banned";

    @Column({nullable:false})
    userId:number;

    @Column({nullable:false})
    groupId:number;

    @ManyToOne(()=>User, user => user.userGroups,{
        nullable:false
    })
    user: User;

    @ManyToOne(()=>Group, group => group.users, {
        nullable:false
    })
    group: Group;
}

export { GroupUser }