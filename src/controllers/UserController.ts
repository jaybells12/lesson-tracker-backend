import { HydratedDocument } from "mongoose";
import { Request, Response, NextFunction } from "express";
import { UserRequest } from "../interfaces/Controller-Interfaces";
import { IUser } from "../interfaces/Model-Interfaces"
import { User } from "../models/User"
import { USER_ROLES } from "../config/userRoles";
import CustomError from "../utilities/CustomError";
/*
   email validation? Role assignment?
*/
export const getUsers = async (req: UserRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  try{
    const roleFilter = getRoleFilter(req.role)
    const results = await User.find(roleFilter).select("-password -refreshToken -__v").orFail().lean();
    return res.status(200).json(results);
  }catch(err){
    return next(err);
  }
}

export const getUserById = async (req: UserRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  try{
    const { id } = req.params;
    const roleFilter = { _id: id, ...getRoleFilter(req.role)}
    const results = await User.findOne(roleFilter).select("-password -refreshToken -__v").orFail().lean();
    return res.status(200).json(results);
  }catch(err){
    return next(err);
  }
}

export const createUser = async (req: UserRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  try{
    const userRole = getRoleName(req.role);
    const { username, password, email, role  }: IUser = req.body;
    if(userRole !== "ADMIN" && role.toLowerCase() === "admin") throw new CustomError("Not authorized to perform this action.", "AuthError")
    const user: HydratedDocument<IUser> = new User({
      username,
      password,
      email,
      role
    })
    const results = await user.save();
    const trimmedResults = removeFields(results.toObject(), "password", "__v", "refreshToken")
    return res.status(201).json(trimmedResults);
  }catch(err){
    return next(err);
  }
}

export const updateUser = async (req: UserRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  try{
    const { id } = req.params;
    const { username, email, password, role }: IUser = req.body;

    const userRole = getRoleName(req.role);
    if(userRole !== "ADMIN" && role.toLowerCase() === "admin") throw new CustomError("Not authorized to perform this action.", "AuthError")
    
    const roleFilter = { _id: id, ...getRoleFilter(req.role)};
    const results = await User.findOneAndUpdate(roleFilter, { username, email, password, role }, { runValidators: true, lean: true, new: true, sanitizeFilter: true }).select("-password -refreshToken -__v").orFail();
    return res.status(200).json(results);
  }catch(err){
    return next(err);
  }
}

export const deleteUser = async (req: UserRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  try{
    const { id } = req.params;
    const roleFilter = { _id: id, ...getRoleFilter(req.role)};
    const results = await User.findOneAndDelete(roleFilter).orFail().select("-password -refreshToken -__v").lean();
    return res.status(200).json(results);
  }catch(err){
    return next(err);
  }
}

//WORKER: Get role by name
const getRoleName = (code: number | undefined): string => {
  if(!code) throw new CustomError("Missing 'role' value.", "AuthError")
  return Object.keys(USER_ROLES).find( key => USER_ROLES[key] === code) || "";
}

//WORKER: Get filter for mongoose queries
const getRoleFilter = ( code: number | undefined ) => {
  if(!code) throw new CustomError("Missing 'role' value.", "AuthError")

  const role = Object.keys(USER_ROLES).find( key => USER_ROLES[key] === code) || "";

  switch(role){
    case "ADMIN":
      return {};
    case "DIRECTOR":
      return {
        role: {
          $ne: "ADMIN"
        }
      }
    case "GUIDE":
    case "PARENT":
    default:
      throw new CustomError("Invalid 'role' value.", "AuthError")
  }
}

//WORKER: Remove fields from a document
const removeFields = ( document: { [key: string]: string}, ...fields: string[] ) => {
  fields.forEach( field => {
      delete document[field]
  })
  return document;
}