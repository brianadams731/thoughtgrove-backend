import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Group } from "./Group";

@Entity()
class GroupBulletin extends BaseEntity{
    @PrimaryColumn()
    id:number;

    @Column({nullable:false})
    message:string;

    
    @ManyToOne(()=>Group, group => group.bulletins, {
        nullable:false
    })
    group:Group;

}

export { GroupBulletin };