import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { GroupDiscussion } from "./GroupDiscussion";
import { User } from "./User";

@Entity()
class DiscussionComment extends BaseEntity{
    @PrimaryColumn()
    id: number;

    @Column({nullable:false})
    content: string;

    @Column({nullable: false})
    discussionId:number;

    @ManyToOne(()=>GroupDiscussion, groupDiscussion => groupDiscussion.comments,{
        onDelete: "CASCADE",
        nullable:false
    })
    discussion: GroupDiscussion;

    @ManyToOne(()=>User, userDiscussionComment => userDiscussionComment.authoredDiscussionComments, {
        onDelete: "CASCADE",
        nullable: false
    })
    author: User;
}

export { DiscussionComment };