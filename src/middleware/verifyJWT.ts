import dotenv from "dotenv";
import { Response, NextFunction } from "express"
import jwt from "jsonwebtoken";
import { UserRequest } from "../interfaces/Controller-Interfaces";
import CustomError from "../utilities/CustomError";

dotenv.config();

export default function verifyJWT( req: UserRequest, res: Response, next: NextFunction): Response | void{
  if(!process.env.ACCESS_TOKEN_SECRET) return next(new CustomError("Missing environment variable: Access Token Secret", "EnvError"))
  
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return next(new CustomError("Missing or invalid authorization header.", "AuthError"))
  
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    try{
      if(err) throw err;
      if(decoded && typeof decoded === 'object'){
        if(req.username && req.username !== decoded.username) throw new CustomError("Missing or mismatched payload.", "PayloadError")
        req.username ??= decoded.username;
        if(req.role && req.role !== decoded.role) throw new CustomError("Missing or mismatched payload.", "PayloadError")
        req.role ??= decoded.role;
        return next();
      }else{
        throw new CustomError("Failure in JWT Verification", "AuthError")
      }
    }catch(err){
      return next(err)
    }
  })
}