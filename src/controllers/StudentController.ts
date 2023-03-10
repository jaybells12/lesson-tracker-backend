import { HydratedDocument } from "mongoose"
import { Request, Response, NextFunction} from "express";
import { IStudent } from "../interfaces/Model-Interfaces"
import { Student } from "../models/Student"

export const getStudents = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try{
    const results = await Student.find({}).orFail().lean();
    return res.status(200).json(results);
  }catch(err){
    next(err);
  }
}

export const getStudentById = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try{
    const { id }  = req.params;
    const results = await Student.findById(id).orFail().lean();
    return res.status(200).json(results);
  }catch(err){
    next(err);
  }
}

export const createStudent = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try{
    const { name, dob }: IStudent = req.body;
    const student: HydratedDocument<IStudent> = new Student({
      name,
      dob
    })
    const results = await student.save()
    return res.status(201).json(results);
  }catch(err){
    next(err);
  }
}

export const updateStudent = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try{
    const { id } = req.params;
    const { name, dob }: IStudent = req.body;
    const results = await Student.findByIdAndUpdate(id, { name, dob }, { runValidators: true, lean: true, new: true, sanitizeFilter: true }).orFail();
    return res.status(200).json(results);
  }catch(err){
    next(err);
  }
}

export const deleteStudent = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try{
    const { id } = req.params;
    const results = await Student.findByIdAndDelete(id).orFail().lean();
    return res.status(200).json(results);
  }catch(err){
    next(err);
  }
}