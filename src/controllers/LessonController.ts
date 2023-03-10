import { HydratedDocument } from "mongoose";
import { Request, Response, NextFunction } from "express";
import { ILesson } from "../interfaces/Model-Interfaces"
import { Lesson } from "../models/Lesson";

export const getLessons = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try{
    const results = await Lesson.find({}).orFail().lean();
    return res.status(200).json(results)
  }catch(err){
    next(err);
  }
}

export const getLessonById = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try{
    const { id }  = req.params;
    const results = Lesson.findById(id).orFail().lean();
    return res.status(200).json(results);
  }catch(err){
    next(err);
  }
}

export const createLesson = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try{
    const { name, area, section, group }: ILesson = req.body;
    const lesson: HydratedDocument<ILesson> = new Lesson({
      name,
      area,
      section,
      group
    })
    const results = await lesson.save();
    return res.status(201).json(results)
  }catch(err){
    next(err);
  }
}

export const updateLesson = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try{
    const { id } = req.params;
    if(!id) throw { name: "QueryError", message: "Missing Lesson Id."}
    const { name, area, section, group }: ILesson = req.body;
    const results = await Lesson.findByIdAndUpdate(id, { name, area, section, group }, { runValidators: true, lean: true, new: true, sanitizeFilter: true }).orFail();
    return res.status(200).json(results);
  }catch(err){
    next(err);
  }
}

export const deleteLesson = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try{
    const { id } = req.params;
    if(!id) throw { name: "QueryError", message: "Missing Lesson Id."}
    const results = await Lesson.findByIdAndDelete(id).orFail().lean();
    return res.status(200).json(results);
  }catch(err){
    next(err);
  }
}