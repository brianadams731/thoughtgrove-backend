import { Response, NextFunction } from "express";
import { User } from "../models/User";

const withUserAsync = async function (req:any,res: Response,next: NextFunction):Promise<void>{
    console.log(req.session);
    const user = await User.findOne(req.session.userID)
    if(!user){
        req.user = undefined;
        return next();
    }
    req.user = user;
    return next();
}

export {withUserAsync};