import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { DiscussionComment } from "./DiscussionComment";
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

    @ManyToOne(()=>Group, group => group.discussions, {
        onDelete:"CASCADE",
        nullable:false
    })
    group:Group;

    @OneToMany(()=>DiscussionComment, discussionComment => discussionComment.discussion)
    comments: DiscussionComment[];
}

export { GroupDiscussion }