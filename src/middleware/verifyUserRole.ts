import { Request, Response, NextFunction } from "express"
import { USER_ROLES } from "../config/userRoles"
import CustomError from "../utilities/CustomError"

const verifyUserRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): Response | void => {
    //Role doesn't exist or is of wrong type: Unauthorized (Identity not known)
    if(!('role' in req) || typeof req.role !== 'number') { return next(new CustomError("Missing role.", "AuthError")) }
    
    if(allowedRoles.map( role => USER_ROLES[role]).includes(req.role)){
      //Role exists, and matches: Authorized (Identity known, access granted)
      return next()
    }else{
      //Role exists, but doesn't match: Forbidden (Identity known, access forbidden)
      return next(new CustomError("Permission denied.", "PermissionError"))
    }
  }
}

export default verifyUserRole;