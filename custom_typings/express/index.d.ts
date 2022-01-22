import { User } from "../../src/models/User";


declare global{ 
    namespace Express {
        interface Request {
            user: User|undefined;
            userGroupRole: "owner"|"moderator"|"user"|"banned"|"none";
            discussionId:number|undefined;
            groupId:number|undefined;
            bulletinId: number|undefined;
            userGroupId: number|undefined;
            discussionCommentId:number|undefined;
        }
    }
}
