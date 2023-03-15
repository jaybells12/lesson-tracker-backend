import { Request, Response, NextFunction } from "express"
import { USER_ROLES } from "../config/userRoles"
import { IRoles } from "../interfaces/Controller-Interfaces"

const verifyUserRole = (allowedRoles: IRoles[]) => {
  return (req: Request, res: Response, next: NextFunction): Response | void => {
    //Role doesn't exist or is of wrong type: Unauthorized (Identity not known)
    if(!('role' in req) || typeof req.role !== 'number') return res.sendStatus(401);
    
    if(allowedRoles.map( role => USER_ROLES[role]).includes(req.role)){
      //Role exists, and matches: Authorized (Identity known, access granted)
      return next()
    }else{
      //Role exists, but doesn't match: Forbidden (Identity known, access forbidden)
      return res.sendStatus(403);
    }
  }
}

export default verifyUserRole;