import CustomError from "../utilities/CustomError"
import { Request, Response, NextFunction } from "express"
import dotenv from "dotenv"
import jwt from "jsonwebtoken"
import { User } from "../models/User"
import { USER_ROLES } from "../config/userRoles"

dotenv.config()

const AT_EXPIRATION = "1m";
const RT_EXPIRATION = "5m";
const DEV_ENV = process.env.NODE_ENV === "development" ? false : true;

//Handle User Login
export const handleLogin = async ( req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try{
    const { username, password }: { username: string, password: string } = req.body;
    if(!username) throw new CustomError("Missing username.", "ReferenceError")
    if(!password) throw new CustomError("Missing password.", "ReferenceError")

    const user = await User.findOne({username}).orFail();
    const match = await user.comparePassword(password);
    if(!match) return res.sendStatus(401) // Can I throw an Error here instead? maybe redirect(401, loginpage)

    const accessToken = createAccessToken(user.username, USER_ROLES[user.role])
    const refreshToken = createRefreshToken(user.username);
    
    user.refreshToken = refreshToken;
    await user.save()
    
    res.cookie(
      'jwt', 
      refreshToken, 
      { 
        httpOnly: true, 
        secure: DEV_ENV, 
        sameSite: 'none', 
        maxAge: 5 * 60 * 1000 // Max age should equal RT_Expiration length
      }
    )
    res.status(200).json({accessToken})
  }catch(err){
    return next(err)
  }
}

//Handle User Logout
export const handleLogout = async ( req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  const cookies = req.cookies;
  if(!cookies?.jwt) return res.sendStatus(204) //204 No-Content
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: DEV_ENV })
  res.status(205).json({ success: true, message: "Cookie cleared." }) //205 Reset Content
}

//Refresh Access Token
export const handleRefresh = async ( req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try{
    if(!process.env.REFRESH_TOKEN_SECRET) throw new CustomError("Missing Environment Variable: Refresh Token Secret", "ReferenceError")

    const cookies = req.cookies;

    if(!cookies?.jwt) return res.sendStatus(401); // Custom Auth Error? 
    
    const refreshToken: string = cookies.jwt;

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async ( err, decoded ) => {
        try{
          if(err) throw err;
          if(decoded && typeof decoded === 'object'){
            const user = await User.findOne({username: decoded.username}).orFail();
            const accessToken = createAccessToken(user.username, USER_ROLES[user.role])
            return res.status(200).json({ accessToken })
          }else{
            throw new CustomError("Failure in JWT Verification", "PayloadError")
          }
        }catch(err){
          return next(err)
        }
      }
    )
  }catch(err){
    return next(err);
  }
}

//WORKER
const createAccessToken = (username: string, role: number): string => {
  if(!process.env.ACCESS_TOKEN_SECRET) throw new CustomError("Missing Environment Variable: Access Token Secret", "ReferenceError")
  return jwt.sign(
    { username, role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: AT_EXPIRATION }
  )
}

//WORKER
const createRefreshToken = (username: string): string => {
  if(!process.env.REFRESH_TOKEN_SECRET) throw new CustomError("Missing Environment Variable: Refresh Token Secret", "ReferenceError")
  return jwt.sign(
    { username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: RT_EXPIRATION }
  )
}