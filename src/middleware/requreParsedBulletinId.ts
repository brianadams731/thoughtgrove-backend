import { NextFunction, Response } from "express";

const requiresParsedBulletinId = (req:any,res:Response,next:NextFunction) =>{
    const bulletinId = parseInt(req.params.bulletinId);
    if(isNaN(bulletinId)){
        return res.status(400).send("Error: Invalid Bulletin Id")
    }
    req.bulletinId = bulletinId;
    next();
}

export { requiresParsedBulletinId }