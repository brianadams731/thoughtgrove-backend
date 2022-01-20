import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Group } from "./Group";
import { User } from "./User";

@Entity()
class GroupDiscussion extends BaseEntity{
    @PrimaryColumn()
    id:number;

    @Column({nullable:false})
    title:string;

    @Column({nullable:false})
    groupId:number;

    @ManyToOne(()=>User, user => user.authoredDiscussions, {nullable:false})
    author:User;

    @ManyToOne(()=>Group, group => group.discussions, {nullable:false})
    group:Group;
}

export { GroupDiscussion }