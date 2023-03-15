import { Lesson } from "../models/Lesson"
import { Student } from "../models/Student"
import { NextFunction, Request, Response } from "express";
import { IStudent } from "../interfaces/Model-Interfaces";
import { IStudentProgress } from "../interfaces/Controller-Interfaces"
import CustomError from "../utilities/CustomError";

export const getProgress = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try{
    const result = await Student.find({}).select("progress").orFail().lean();
    return res.status(200).json(result);
  }catch(err){
    return next(err)
  }
}

export const getProgressById = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try{
    const { id } = req.params;
    if(!id) throw new CustomError("Missing ID value.", "ReferenceError")
    const result = await Student.findById(id).select("progress").orFail().lean();
    return res.status(200).json(result);
  }catch(err){
    return next(err)
  }
}

export const updateSingleProgress = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try{
    const { id }= req.params;
    const { progress }: { progress: Map<string, string> } = req.body;
    const result =  await updateProgress(id, progress);
    return res.status(200).json(result);
  }catch(err){
    return next(err);
  }
}

export const updateManyProgress = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try{
    const { students }: IStudentProgress = req.body;
    const results: IStudent[] = []
    for(let studentId in students){
      results.push(await updateProgress(studentId, students[studentId])) 
    }
    return res.status(200).json(results);
  }catch(err){
    return next(err);
  }
}

//WORKER: Verify Lesson Exists
const verifyLessonId = async (id: string): Promise<void> => {
  Lesson.exists({_id: id}).orFail()
}

//WORKER: Partial data validation, Sets or Deletes an entry
const updateProgress = async ( id: string, progress: Map<string, string>): Promise<IStudent> => {
  if(!id) throw new CustomError("Missing ID value.", "ReferenceError")
  if(!(progress instanceof Map)) throw new CustomError("'Progress' value should be of type 'map'.", "TypeError")
  if(progress.size === 0) throw new CustomError("'Progress' map is empty.", "ReferenceError")
  try{
    const student = await Student.findById(id).orFail();
    for(let [lessonId, lessonFlag] of progress){
      await verifyLessonId(lessonId);
      if(lessonFlag){
        student.progress.set(lessonId, lessonFlag)
      }else{
        student.progress.delete(lessonId);
      }
    }
    return student.save();
  }catch(err){
    throw err;
  }
}