import { HydratedDocument } from "mongoose";
import { Request, Response, NextFunction } from "express";
import { IUser } from "../interfaces/Model-Interfaces"
import { User } from "../models/User"
/*
   email validation? Role assignment?
*/
export const getUsers = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try{
    const results = await User.find({}).select("-password").orFail().lean();
    return res.status(200).json(results);
  }catch(err){
    return next(err);
  }
}

export const getUserById = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try{
    const { id } = req.params;
    const results = await User.findById(id).orFail().lean();
    return res.status(200).json(results);
  }catch(err){
    return next(err);
  }
}

export const createUser = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try{
    const { username, password, email, role  }: IUser = req.body;
    const user: HydratedDocument<IUser> = new User({
      username,
      password,
      email,
      role
    })
    const results = await user.save();
    return res.status(201).json(results);
  }catch(err){
    return next(err);
  }
}

export const updateUser = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try{
    const { id } = req.params;
    const { username, email, password, role }: IUser = req.body;
    const results = await User.findByIdAndUpdate(id, { username, email, password, role }, { runValidators: true, lean: true, new: true, sanitizeFilter: true }).orFail();
    return res.status(200).json(results);
  }catch(err){
    return next(err);
  }
}

export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try{
    const { id } = req.params;
    const results = await User.findByIdAndDelete(id).orFail().lean();
    return res.status(200).json(results);
  }catch(err){
    return next(err);
  }
}